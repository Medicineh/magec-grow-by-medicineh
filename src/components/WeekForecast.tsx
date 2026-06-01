import { DailyData, getWeatherDescription } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  daily: DailyData;
}

export function WeekForecast({ daily }: Props) {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">📅 Pronóstico 7 Días</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {daily.time.map((day, i) => {
            const w = getWeatherDescription(daily.weatherCode[i]);
            const date = new Date(day);
            const dayName = i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short' });
            return (
              <div
                key={day}
                className="min-w-[110px] flex-shrink-0 rounded-lg border border-border bg-muted/30 p-3 text-center space-y-1"
              >
                <p className="text-xs font-medium">{dayName}</p>
                <p className="text-2xl">{w.icon}</p>
                <p className="text-xs text-muted-foreground">{w.label}</p>
                <div className="flex justify-center gap-1 text-sm">
                  <span className="font-semibold">{daily.temperatureMax[i]}°</span>
                  <span className="text-muted-foreground">{daily.temperatureMin[i]}°</span>
                </div>
                <p className="text-xs text-accent">💧 {daily.precipitationProbabilityMax[i]}%</p>
                <p className="text-xs text-muted-foreground">UV {daily.uvIndexMax[i]}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
