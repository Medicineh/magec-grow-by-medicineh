License: Educational / Non-Commercial Source-Available
This project is source-available for educational and non-commercial purposes. It is not open source. Commercial use, redistribution, forks, and derivative works require prior written permission.



# magec-grow

Este proyecto **SERVERLESS* para ejecutarse.
Es una app frontend construida con Vite + React y puede correrse en tu PC o desplegarse en cualquier servidor estático.

## Requisitos

- Node.js 20+
- npm 10+

## Probar en tu PC (desarrollo)

```bash
npm install
npm run dev
```

Luego abre: `http://localhost:8080`

## Probar build de producción en tu PC

```bash
npm install
npm run build
npm run preview
```

Luego abre: `http://localhost:4173`

## Desplegar en servidor normal (sin Netlify)

1. Genera los archivos estáticos:

```bash
npm ci
npm run build
```

2. Sube el contenido de `dist/` al servidor web (Nginx, Apache, Caddy, etc.).

### Ejemplo Nginx (SPA)

```nginx
server {
  listen 80;
  server_name _;

  root /var/www/magec-grow/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Integración Telegram (nuevo modelo seguro)

Las alertas de Telegram se envían mediante la función de Supabase `send-telegram-alert`.

- El bot usa `TELEGRAM_BOT_TOKEN` desde variables de entorno del backend.
- El frontend **no** almacena ni expone el token.
- En la UI solo se pide `chatId` para suscripción y pruebas.
- Las notificaciones automáticas se generan exclusivamente mediante `weather-alert-cron`; mostrar una alerta en el navegador no envía mensajes de Telegram.
- El único envío iniciado manualmente desde el frontend es el botón de prueba de la configuración.

### Variables necesarias en Supabase

- `TELEGRAM_BOT_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (ya usada por `weather-alert-cron`)

## Despliegue con Docker

También puedes usar el Dockerfile incluido:

```bash
docker build -t magec-grow .
docker run --rm -p 8080:80 magec-grow
```

App disponible en `http://localhost:8080`

## Seguridad y acceso de tablas (RLS)

Con las políticas de Row Level Security activadas:

### Tablas accesibles para usuarios autenticados

- `public.weather_alert_subscriptions`
  - `SELECT/INSERT/UPDATE/DELETE` solo cuando `owner_user_id = auth.uid()`.
- `public.weather_alert_evaluations`
  - `SELECT` solo si la fila pertenece a una suscripción cuyo `owner_user_id = auth.uid()`.

### Tablas backend-only (sin acceso directo desde cliente)

Estas tablas se usan desde service role / funciones backend (por ejemplo cron o edge functions), y están bloqueadas para `anon` y `authenticated`:

- `public.weather_alert_cron_control`
- `public.weather_alert_cron_runs`
- `public.telegram_alert_send_limits`

## Remediación de suscripciones meteorológicas históricas sin propietario

La migración `supabase/migrations/20260601_weather_alert_subscription_owner_remediation.sql` aplica una política de transición explícita para las filas históricas de `public.weather_alert_subscriptions` creadas antes de incorporar `owner_user_id`:

1. Registra cada fila con `owner_user_id is null` en la cola de auditoría administrativa `public.weather_alert_subscription_owner_remediation`.
2. Desactiva esas filas (`is_active = false`) para que no se procesen mientras no tengan propietario verificado.
3. Añade la restricción `weather_alert_subscriptions_active_requires_owner`, que impide activar cualquier suscripción sin propietario.
4. Mantiene `owner_user_id` nullable de forma intencionada: el valor nulo representa una fila heredada en cuarentena. No se aplica `NOT NULL` porque eliminaría ese estado transitorio seguro. El modelo funcional exige propietario para toda suscripción **activa**, y la restricción lo garantiza.

La tabla de remediación tiene RLS activado y revoca acceso a `anon` y `authenticated`. No se expone ninguna función de reclamación al cliente. **Conocer únicamente el `chat_id` nunca es prueba suficiente para reclamar una suscripción.**

### Procedimiento de despliegue

1. Antes de aplicar la migración, contar y revisar las filas heredadas:

   ```sql
   select id, chat_id, is_active, created_at
   from public.weather_alert_subscriptions
   where owner_user_id is null
   order by created_at;
   ```

2. Aplicar las migraciones de Supabase por el mecanismo habitual del entorno.
3. Verificar que ninguna fila sin propietario permanezca activa y revisar la cola administrativa:

   ```sql
   select count(*) as invalid_active_subscriptions
   from public.weather_alert_subscriptions
   where owner_user_id is null and is_active;

   select transition_action, count(*)
   from public.weather_alert_subscription_owner_remediation
   group by transition_action
   order by transition_action;
   ```

   `invalid_active_subscriptions` debe ser `0`.

4. Para cada reclamación, un operador debe verificar la titularidad mediante evidencia independiente del `chat_id`, por ejemplo un desafío iniciado desde el bot autenticado o un ticket de soporte validado. Después debe ejecutar una actualización privilegiada y auditable dentro de una transacción, usando el `id` interno de la suscripción y el UUID del usuario autenticado:

   ```sql
   begin;

   update public.weather_alert_subscriptions
   set owner_user_id = :'verified_owner_user_id', updated_at = now()
   where id = :'subscription_id'
     and owner_user_id is null
     and not is_active;

   update public.weather_alert_subscription_owner_remediation
   set transition_action = 'claimed_after_verification',
       claimed_owner_user_id = :'verified_owner_user_id',
       claimed_at = now(),
       verification_reference = :'verification_reference'
   where subscription_id = :'subscription_id'
     and transition_action = 'deactivated_pending_verified_claim';

   commit;
   ```

   Antes de confirmar, el operador debe comprobar que ambas sentencias actualizaron exactamente una fila. La reactivación, si corresponde, se realiza después de esa asignación verificada; la restricción evita invertir el orden. Las filas obsoletas pueden marcarse como `retired_as_obsolete` y eliminarse mediante un proceso administrativo separado.

### Procedimiento de recuperación

Si una versión anterior del backend resulta incompatible con la restricción, mantener las filas heredadas en cuarentena y retirar temporalmente solo la restricción mientras se corrige el backend:

```sql
alter table public.weather_alert_subscriptions
  drop constraint if exists weather_alert_subscriptions_active_requires_owner;
```

No se deben reactivar masivamente filas con `owner_user_id is null`. Si se necesita restaurar el estado activo previo de filas que ya recibieron un propietario verificado, usar la auditoría:

```sql
update public.weather_alert_subscriptions as subscriptions
set is_active = remediation.previous_is_active,
    updated_at = now()
from public.weather_alert_subscription_owner_remediation as remediation
where remediation.subscription_id = subscriptions.id
  and remediation.transition_action = 'claimed_after_verification'
  and subscriptions.owner_user_id is not null;
```

Después de corregir la incompatibilidad, volver a añadir y validar la restricción antes de continuar con nuevas reactivaciones.

```sql
alter table public.weather_alert_subscriptions
  add constraint weather_alert_subscriptions_active_requires_owner
  check (not is_active or owner_user_id is not null)
  not valid;

alter table public.weather_alert_subscriptions
  validate constraint weather_alert_subscriptions_active_requires_owner;
```
# magec-grow-by-medicineh
# magec-grow-by-medicineh
# magec-grow-by-medicineh
# magec-grow-by-medicineh
# magec-grow-by-medicineh
