import { HourlyData } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  type TooltipProps,
  CartesianGrid,
  ReferenceArea,
} from 'recharts';

type TooltipPayload = NonNullable<TooltipProps<number, string>['payload']>[number];

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

// custom tooltip to add icons
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const hour = label;
    const temp = payload.find((p) => p.dataKey === 'temp')?.value;
    const hum = payload.find((p) => p.dataKey === 'humidity')?.value;
    const wind = payload.find((p) => p.dataKey === 'wind')?.value;
    return (
      <div className="bg-white p-2 rounded shadow-lg text-xs">
        <div>{hour}</div>
        <div className="flex items-center gap-1">
          🌡️ <span>{temp}°C</span>
        </div>
        <div className="flex items-center gap-1">
          💧 <span>{hum}%</span>
        </div>
        <div className="flex items-center gap-1">
          💨 <span>{wind} km/h</span>
        </div>
      </div>
    );
  }
  return null;
}

interface Props {
  hourly: HourlyData;
}

// thresholds tuned for outdoor cannabis in Lanzarote
function getTempStatus(temp: number) {
  if (temp < 10 || temp > 30) return { label: 'Mala', color: 'text-red-500' };
  if (temp < 18 || temp > 26) return { label: 'Neutral', color: 'text-yellow-500' };
  return { label: 'Buena', color: 'text-green-500' };
}

function getHumStatus(hum: number) {
  if (hum < 30 || hum > 70) return { label: 'Mala', color: 'text-red-500' };
  if (hum < 40 || hum > 60) return { label: 'Neutral', color: 'text-yellow-500' };
  return { label: 'Buena', color: 'text-green-500' };
}

function getWindStatus(wind: number) {
  if (wind > 40) return { label: 'Mala', color: 'text-red-500' };
  if (wind > 20) return { label: 'Neutral', color: 'text-yellow-500' };
  return { label: 'Buena', color: 'text-green-500' };
}

function getOverallCondition(tStatus: { label: string }, hStatus: { label: string }, wStatus: { label: string }) {
  // if any are bad => mala; else if any neutral => neutral; else todos buenos
  if (tStatus.label === 'Mala' || hStatus.label === 'Mala' || wStatus.label === 'Mala') {
    return { text: 'Condiciones no ideales para el cultivo', color: 'text-red-500' };
  }
  if (tStatus.label === 'Neutral' || hStatus.label === 'Neutral' || wStatus.label === 'Neutral') {
    return { text: 'Condiciones aceptables pero monitorear', color: 'text-yellow-500' };
  }
  return { text: 'Condiciones óptimas para crecimiento', color: 'text-green-500' };
}

export function HourlyChart({ hourly }: Props) {
  const { toast } = useToast();
  // Show next 24 hours from current hour
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toLocaleDateString('en-CA');
  const startIdx = hourly.time.findIndex(t => t.startsWith(todayStr) && new Date(t).getHours() === currentHour);
  const start = Math.max(startIdx, 0);

  const data = hourly.time.slice(start, start + 24).map((t, i) => ({
    time: new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', hour12: false }),
    temp: hourly.temperature[start + i],
    humidity: hourly.humidity[start + i],
    wind: hourly.windSpeed ? hourly.windSpeed[start + i] : 0, // viento opcional
  }));

  // compute hourly statuses for indicator row and summary
  const hourStatuses = data.map(d => {
    const t = getTempStatus(d.temp).label;
    const h = getHumStatus(d.humidity).label;
    const w = getWindStatus(d.wind).label;
    return t === 'Mala' || h === 'Mala' || w === 'Mala' ? 'bad' : t === 'Neutral' || h === 'Neutral' || w === 'Neutral' ? 'neutral' : 'good';
  });
  const badHourCount = hourStatuses.filter(s => s === 'bad').length;

  useEffect(() => {
    if (badHourCount >= 3) {
      toast({
        title: 'Condiciones adversas',
        description: `Se esperan ${badHourCount}h de mal clima en las próximas 24h`,
      });
    }
  }, [badHourCount, toast]);

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          🌿 Próximas 24 Horas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="temp" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="hum" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '3 3' }}
              />
              {/* threshold bands */}
              <ReferenceArea y1={18} y2={26} strokeOpacity={0} fill="rgba(52, 211, 153, 0.1)" />
              <ReferenceArea y1={10} y2={18} strokeOpacity={0} fill="rgba(234, 179, 8, 0.1)" />
              <ReferenceArea y1={26} y2={30} strokeOpacity={0} fill="rgba(234, 179, 8, 0.1)" />
              <ReferenceArea y1={-100} y2={10} strokeOpacity={0} fill="rgba(239, 68, 68, 0.1)" />
              <ReferenceArea y1={30} y2={100} strokeOpacity={0} fill="rgba(239, 68, 68, 0.1)" />
              <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#f97316" name="Temp °C" strokeWidth={2} dot={false} />
              <Line yAxisId="hum" type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humedad %" strokeWidth={2} dot={false} />
              <Line yAxisId="hum" type="monotone" dataKey="wind" stroke="#a855f7" name="Viento km/h" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-orange-500 inline-block" /> 🌡️ Temperatura</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-blue-500 inline-block" /> 💧 Humedad</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-purple-500 inline-block" /> <span className="animate-spin inline-block">💨</span> Viento</span>
        </div>
        {/* hourly indicator row */}
        <div className="mt-2 flex justify-center gap-1">
          {hourStatuses.map((s, idx) => (
            <div
              key={idx}
              className={`w-2 h-6 ${s === 'good' ? 'bg-green-500 animate-ping' : s === 'neutral' ? 'bg-yellow-500 animate-bounce' : 'bg-red-500 animate-pulse'}`}
            />
          ))}
        </div>
        {/* summary badge */}
        <div className="mt-1 text-center text-xs text-muted-foreground">
          ⚠️ {badHourCount}h de mal clima en las próximas 24h
        </div>
        {/* status indicators */}
        {data.length > 0 && (() => {
          // calcular promedio sobre la ventana mostrada
          const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
          const temps = data.map(d => d.temp);
          const hums = data.map(d => d.humidity);
          const winds = data.map(d => d.wind);
          const avgTemp = avg(temps);
          const avgHum = avg(hums);
          const avgWind = avg(winds);
          const tStatus = getTempStatus(avgTemp);
          const hStatus = getHumStatus(avgHum);
          const wStatus = getWindStatus(avgWind);
          const overall = getOverallCondition(tStatus, hStatus, wStatus);
          return (
            <div className="mt-6 mb-2">
              <h4 className="text-center font-medium mb-4">Promedio próximas 24h</h4>
              <div className="flex flex-col gap-4 text-sm max-w-[280px] mx-auto">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">🌡️ Temperatura</span>
                    <span className={`font-semibold ${tStatus.color}`}>{avgTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${tStatus.label === 'Buena' ? 'bg-green-500' : tStatus.label === 'Neutral' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (avgTemp / 40) * 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground text-right">{tStatus.label === 'Buena' ? '✅ Ideal' : tStatus.label === 'Neutral' ? '⚠️ Aceptable' : '❌ Peligro'} ({tStatus.label})</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">💧 Humedad</span>
                    <span className={`font-semibold ${hStatus.color}`}>{avgHum.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${hStatus.label === 'Buena' ? 'bg-green-500' : hStatus.label === 'Neutral' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${avgHum}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground text-right">{hStatus.label === 'Buena' ? '✅ Ideal' : hStatus.label === 'Neutral' ? '⚠️ Aceptable' : '❌ Peligro'} ({hStatus.label})</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">💨 Viento</span>
                    <span className={`font-semibold ${wStatus.color}`}>{avgWind.toFixed(0)} km/h</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${wStatus.label === 'Buena' ? 'bg-green-500' : wStatus.label === 'Neutral' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (avgWind / 60) * 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground text-right">{wStatus.label === 'Buena' ? '✅ Ideal' : wStatus.label === 'Neutral' ? '⚠️ Aceptable' : '❌ Peligro'} ({wStatus.label})</p>
                </div>
              </div>

              <div className="mt-6 text-center text-sm bg-muted/30 py-2 rounded-lg border border-border">
                <span className={`font-medium ${overall.color}`}>{overall.text}</span>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
