import { DailyData } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  daily: DailyData;
}

export function WindForecast({ daily }: Props) {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">🌬️ Pronóstico de Viento 7 Días</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {daily.time.map((day, i) => {
            const date = new Date(day);
            const dayName = i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short' });
            const windSpeed = daily.windSpeedMax[i];
            let windIcon = '🌬️';
            let windLabel = 'Calma';
            if (windSpeed >= 20) windIcon = '💨';
            if (windSpeed >= 30) windLabel = 'Fuerte';
            if (windSpeed >= 40) windLabel = 'Muy fuerte';
            return (
              <div
                key={day}
                className="min-w-[110px] flex-shrink-0 rounded-lg border border-border bg-muted/30 p-3 text-center space-y-1"
              >
                <p className="text-xs font-medium">{dayName}</p>
                <p className="text-2xl">{windIcon}</p>
                <p className="text-xs text-muted-foreground">{windLabel}</p>
                <div className="text-sm">
                  <span className="font-semibold">{windSpeed} km/h</span>
                </div>
                <p className="text-xs text-accent">Máx. diario</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}