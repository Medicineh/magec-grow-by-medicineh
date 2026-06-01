import { WeatherResponse } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Droplets, Sun, TrendingUp } from 'lucide-react';

interface EnvironmentalMetricsProps {
  data: WeatherResponse;
}

function calculateVPD(temp: number, humidity: number): number {
  const satVP = 0.6108 * Math.exp(17.27 * temp / (temp + 237.3));
  const actualVP = satVP * (humidity / 100);
  return satVP - actualVP;
}

function calculateDLI(uvIndex: number, cloudCover: number, photoperiod: number): number {
  // Estimate PPFD from UV index and cloud cover
  const clearSkyPPFD = uvIndex * 100; // rough estimate
  const ppfd = clearSkyPPFD * (1 - cloudCover / 200); // cloud attenuation
  return (ppfd * photoperiod * 3600) / 1000000;
}

function calculateStressIndex(temp: number, humidity: number, wind: number): {
  score: number;
  level: string;
  color: string;
} {
  let score = 0;
  const tempDeviation = Math.abs(temp - 23);
  if (tempDeviation > 8) score += 30;
  else if (tempDeviation > 5) score += 20;
  else if (tempDeviation > 3) score += 10;

  if (humidity < 40 || humidity > 75) score += 20;
  else if (humidity < 45 || humidity > 70) score += 10;

  if (wind > 25) score += 25;
  else if (wind > 20) score += 15;
  else if (wind < 2) score += 10;

  let level, color;
  if (score >= 50) { level = 'Crítico'; color = 'rgb(239 68 68)'; }
  else if (score >= 30) { level = 'Alto'; color = 'rgb(249 115 22)'; }
  else if (score >= 15) { level = 'Moderado'; color = 'rgb(234 179 8)'; }
  else { level = 'Óptimo'; color = 'rgb(34 197 94)'; }

  return { score, level, color };
}

export function EnvironmentalMetrics({ data }: EnvironmentalMetricsProps) {
  const { current, hourly } = data;

  const vpd = calculateVPD(current.temperature, current.humidity);
  const stressIndex = calculateStressIndex(current.temperature, current.humidity, current.windSpeed);
  const dli = calculateDLI(current.uvIndex, current.cloudCover, 12);

  // Estimate ET0 from temperature and wind (simplified Hargreaves)
  const todayMax = data.daily.temperatureMax[0];
  const todayMin = data.daily.temperatureMin[0];
  const tMean = (todayMax + todayMin) / 2;
  const Ra = 30; // extraterrestrial radiation for 29°N approx MJ/m²/day
  const et0 = 0.0023 * (tMean + 17.8) * Math.sqrt(todayMax - todayMin) * Ra * 0.408;

  const metrics = [
    {
      title: 'Déficit Presión Vapor',
      value: vpd.toFixed(2),
      unit: 'kPa',
      icon: Activity,
      status: vpd > 1.5 ? 'Alto' : vpd < 0.5 ? 'Bajo' : 'Óptimo',
      statusColor: vpd > 1.5 ? 'rgb(239 68 68)' : vpd < 0.5 ? 'rgb(59 130 246)' : 'rgb(34 197 94)',
      description: 'Motor de la transpiración. Rango óptimo: 0.8-1.2 kPa'
    },
    {
      title: 'ET₀ Hargreaves',
      value: et0.toFixed(1),
      unit: 'mm/día',
      icon: Droplets,
      status: et0 > 6 ? 'Alto' : et0 < 2 ? 'Bajo' : 'Normal',
      statusColor: et0 > 6 ? 'rgb(239 68 68)' : et0 < 2 ? 'rgb(59 130 246)' : 'rgb(34 197 94)',
      description: 'Evapotranspiración de referencia estimada por método Hargreaves-Samani'
    },
    {
      title: 'Integral Luz Diaria',
      value: dli.toFixed(1),
      unit: 'mol/m²/d',
      icon: Sun,
      status: dli > 40 ? 'Alto' : dli < 20 ? 'Bajo' : 'Óptimo',
      statusColor: dli > 40 ? 'rgb(239 68 68)' : dli < 20 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
      description: 'Estimación de radiación fotosintéticamente activa acumulada (10–20 sombra, 20–30 veg. fuerte, 30–40 cultivos demandantes)'
    },
    {
      title: 'Índice de Estrés',
      value: stressIndex.score.toString(),
      unit: '/100',
      icon: TrendingUp,
      status: stressIndex.level,
      statusColor: stressIndex.color,
      description: 'Evaluación integrada: temperatura, humedad y viento'
    }
  ];

  const summary = metrics.map(metric => ({
    name: metric.title,
    state: metric.status
  }));

  const overallComment = stressIndex.level === 'Crítico' ? 'Condiciones ambientales críticas requieren atención inmediata' :
                         stressIndex.level === 'Alto' ? 'Condiciones ambientales desafiantes, monitorear de cerca' :
                         'Condiciones ambientales favorables para el crecimiento vegetal';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Métricas Ambientales Avanzadas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análisis agronómico basado en principios de fisiología vegetal
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{metric.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {metric.value} <span className="text-xs text-muted-foreground">{metric.unit}</span>
                </span>
                <Badge variant="outline" style={{ borderColor: metric.statusColor, color: metric.statusColor, fontSize: '10px' }}>
                  {metric.status}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            {metric.title === 'Índice de Estrés' && (
              <Progress value={parseInt(metric.value)} className="h-2" />
            )}
          </div>
        ))}
        {/* Tabla de referencia de DLI */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs">
          <h4 className="font-semibold mb-2">Rangos de DLI y tipo de planta</h4>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1">DLI&nbsp;(mol/m²/día)</th>
                <th className="py-1">Tipo de planta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">10–20</td>
                <td className="py-1">Plantas de sombra</td>
              </tr>
              <tr>
                <td className="py-1">20–30</td>
                <td className="py-1">Vegetación fuerte</td>
              </tr>
              <tr>
                <td className="py-1">30–40</td>
                <td className="py-1">Cultivos muy demandantes</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* resumen de estado ambiental */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Resumen del estado ambiental</h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th className="py-1">Métrica</th>
                <th className="py-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-1">{row.name}</td>
                  <td className="py-1">{row.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">{overallComment}</p>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Análisis Técnico:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            {vpd > 1.5 && <li>• VPD elevado: transpiración excesiva, considerar nebulización</li>}
            {vpd < 0.5 && <li>• VPD bajo: riesgo de condensación y patógenos fúngicos</li>}
            {et0 > 5 && <li>• Alta demanda evaporativa: CWR = ET₀ × Kc ({(et0 * 1.2).toFixed(1)} mm/día)</li>}
            <li>• VPD = e<sub>s</sub>(T) - e<sub>a</sub> = {vpd.toFixed(3)} kPa</li>
            <li>• ET₀ = 0.0023 × (T<sub>mean</sub>+17.8) × √(ΔT) × R<sub>a</sub> × 0.408</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}