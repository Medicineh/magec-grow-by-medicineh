import { CurrentWeather as CW, getWeatherDescription, getWindDirection } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Wind, Cloud, Thermometer, Eye, Umbrella, Activity, Gauge } from 'lucide-react';

interface Props {
  data: CW;
}

// Thermal comfort index (Humidex)
function calculateHumidex(temp: number, dewPoint: number): number {
  const e = 6.112 * Math.exp(17.67 * dewPoint / (dewPoint + 243.5));
  return temp + 0.5555 * (e - 10);
}

// Estimate dew point from temp and humidity
function getDewPoint(temp: number, humidity: number): number {
  const a = 17.27, b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

// Wind Chill or Heat Index
function getHeatIndex(temp: number, humidity: number): number | null {
  if (temp < 27) return null;
  const T = temp, H = humidity;
  return -8.78469475556 + 1.61139411 * T + 2.33854883889 * H
    - 0.14611605 * T * H - 0.012308094 * T * T
    - 0.0164248277778 * H * H + 0.002211732 * T * T * H
    + 0.00072546 * T * H * H - 0.000003582 * T * T * H * H;
}

function getUVCategory(uv: number): { label: string; color: string } {
  if (uv >= 11) return { label: 'Extremo', color: 'rgb(139 0 0)' };
  if (uv >= 8) return { label: 'Muy Alto', color: 'rgb(239 68 68)' };
  if (uv >= 6) return { label: 'Alto', color: 'rgb(249 115 22)' };
  if (uv >= 3) return { label: 'Moderado', color: 'rgb(234 179 8)' };
  return { label: 'Bajo', color: 'rgb(34 197 94)' };
}

function getWindScale(speed: number): { label: string; description: string; color: string } {
  if (speed < 1) return { label: 'Calma', description: 'Beaufort 0', color: 'rgb(34 197 94)' };
  if (speed < 12) return { label: 'Brisa', description: 'Beaufort 1-2', color: 'rgb(34 197 94)' };
  if (speed < 29) return { label: 'Brisa Leve', description: 'Beaufort 3-4', color: 'rgb(234 179 8)' };
  if (speed < 50) return { label: 'Brisa Fuerte', description: 'Beaufort 5-6', color: 'rgb(249 115 22)' };
  if (speed < 75) return { label: 'Viento Fuerte', description: 'Beaufort 7-8', color: 'rgb(239 68 68)' };
  return { label: 'Tempestad', description: 'Beaufort 9+', color: 'rgb(139 0 0)' };
}

export function CurrentWeather({ data }: Props) {
  const weather = getWeatherDescription(data.weatherCode);
  const windDir = getWindDirection(data.windDirection);
  const dewPoint = getDewPoint(data.temperature, data.humidity);
  const humidex = calculateHumidex(data.temperature, dewPoint);
  const heatIndex = getHeatIndex(data.temperature, data.humidity);
  const uvCat = getUVCategory(data.uvIndex);
  const windScale = getWindScale(data.windSpeed);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">{weather.icon}</span>
          Condiciones Actuales
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Lanzarote — 29.05°N, 13.59°W · Zona horaria: Atlantic/Canary
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main temperature block */}
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold">{data.temperature.toFixed(1)}°C</span>
          <div className="text-sm text-muted-foreground">
            <div>Sensación: {data.apparentTemperature.toFixed(1)}°C</div>
            <div>Humedad: {humidex.toFixed(1)}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{weather.label}</Badge>
          {heatIndex && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              Índice Calor: {heatIndex.toFixed(0)}°C
            </Badge>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Key variables grid */}
        <div className="grid grid-cols-2 gap-3">
          <Stat
            icon={<Droplets className="h-4 w-4 text-blue-500" />}
            label="Humedad Relativa"
            value={`${data.humidity}%`}
            sub={`Punto rocío: ${dewPoint.toFixed(1)}°C`}
          />
          <Stat
            icon={<Wind className="h-4 w-4 text-muted-foreground" />}
            label="Viento"
            value={`${data.windSpeed} km/h ${windDir}`}
            sub={`${windScale.label} — ${windScale.description}`}
            subColor={windScale.color}
          />
          <Stat
            icon={<Eye className="h-4 w-4 text-yellow-500" />}
            label="Índice UV"
            value={data.uvIndex.toFixed(1)}
            sub={uvCat.label}
            subColor={uvCat.color}
          />
          <Stat
            icon={<Cloud className="h-4 w-4 text-muted-foreground" />}
            label="Nubosidad"
            value={`${data.cloudCover}%`}
            sub={data.cloudCover < 25 ? 'Despejado' : data.cloudCover < 50 ? 'Pocas nubes' : 'Nublado'}
          />
          <Stat
            icon={<Umbrella className="h-4 w-4 text-blue-400" />}
            label="Precipitación"
            value={`${data.precipitation} mm`}
            sub="Acumulado hora actual"
          />
          <Stat
            icon={<Gauge className="h-4 w-4 text-purple-400" />}
            label="Presión VP"
            value={`${(0.6108 * Math.exp(17.27 * data.temperature / (data.temperature + 237.3))).toFixed(2)} kPa`}
            sub="Presión vapor saturado"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value, sub, subColor }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground" style={{ color: subColor }}>{sub}</p>}
      </div>
    </div>
  );
}