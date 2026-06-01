import { useSettings } from '@/context/SettingsContext';
import { useAlertHistory } from '@/hooks/useAlertHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function statusColor(status: 'normal' | 'warning' | 'danger') {
  if (status === 'danger') return 'rgb(239 68 68)';
  if (status === 'warning') return 'rgb(234 179 8)';
  return 'rgb(34 197 94)';
}

export function AlertTraceabilityCard() {
  const { telegramChatId } = useSettings();
  const { history, latest, isLoading } = useAlertHistory(telegramChatId || undefined);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trazabilidad de Alertas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {!telegramChatId && (
          <p className="text-muted-foreground">Configura tu Chat ID en Telegram para ver el historial backend.</p>
        )}

        {telegramChatId && isLoading && <p className="text-muted-foreground">Cargando historial…</p>}

        {latest && (
          <div className="p-2 rounded-md border bg-muted/40">
            <div className="flex items-center justify-between">
              <span>Última evaluación</span>
              <Badge style={{ borderColor: statusColor(latest.status), color: statusColor(latest.status) }} variant="outline">
                {latest.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(latest.evaluated_at).toLocaleString('es-ES')}
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-2">
            {history.slice(0, 8).map((row) => (
              <div key={row.id} className="text-xs p-2 rounded border flex items-center justify-between">
                <span>{new Date(row.evaluated_at).toLocaleString('es-ES')}</span>
                <Badge style={{ borderColor: statusColor(row.status), color: statusColor(row.status) }} variant="outline">
                  {row.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
