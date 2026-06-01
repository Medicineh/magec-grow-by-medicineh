import { getSolarData, formatHours } from '@/lib/solar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sunrise, Sunset } from 'lucide-react';

export function SolarInfo() {
  const now = new Date();
  const solar = getSolarData(now);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">🌞</span>
          Datos Solares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Amanecer</span>
          </div>
          <span className="font-medium">{solar.sunrise}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sunset className="h-4 w-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Atardecer</span>
          </div>
          <span className="font-medium">{solar.sunset}</span>
        </div>

        <div className="h-px bg-border my-2" />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duración del día</span>
          <span className="font-medium" style={{ color: 'hsl(var(--sun-warm))' }}>{formatHours(solar.dayLengthHours)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duración de la noche</span>
          <span className="font-medium" style={{ color: 'hsl(var(--moon-cool))' }}>{formatHours(solar.nightLengthHours)}</span>
        </div>

        {/* Day/night bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex mt-2">
          <div
            className="h-full rounded-l-full"
            style={{ width: `${(solar.dayLengthHours / 24) * 100}%`, background: 'hsl(var(--sun-warm))' }}
          />
          <div
            className="h-full rounded-r-full"
            style={{ width: `${(solar.nightLengthHours / 24) * 100}%`, background: 'hsl(var(--moon-cool))' }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>☀️ {((solar.dayLengthHours / 24) * 100).toFixed(0)}%</span>
          <span>🌙 {((solar.nightLengthHours / 24) * 100).toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
