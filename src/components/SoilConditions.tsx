import { HourlyData } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, Thermometer, Activity, TestTube } from 'lucide-react';

interface Props {
  hourly: HourlyData;
}

function calculateWaterStressIndex(moisture: number, temp: number): number {
  let stress = 0;
  if (moisture < 0.15) stress += (0.15 - moisture) * 3;
  else if (moisture > 0.35) stress += (moisture - 0.35) * 1.5;
  const tempDeviation = Math.abs(temp - 21);
  if (tempDeviation > 3) stress += tempDeviation * 0.02;
  return Math.min(stress, 1.0);
}

function getMoistureStatus(moisture: number): { text: string; color: string } {
  if (moisture < 0.10) return { text: 'Estrés Hídrico Severo', color: 'rgb(239 68 68)' };
  if (moisture < 0.20) return { text: 'Déficit Hídrico', color: 'rgb(249 115 22)' };
  if (moisture < 0.35) return { text: 'Capacidad Campo', color: 'rgb(34 197 94)' };
  return { text: 'Saturación', color: 'rgb(59 130 246)' };
}

function getSoilTempStatus(temp: number): { text: string; color: string; recommendation: string } {
  if (temp < 12) return { 
    text: 'Frío', color: 'rgb(59 130 246)', 
    recommendation: 'Suelo demasiado frío para germinación. Actividad microbiana reducida.'
  };
  if (temp < 18) return { 
    text: 'Subóptimo', color: 'rgb(234 179 8)', 
    recommendation: 'Adecuado para cultivos de temporada fría. Absorción de nutrientes limitada.'
  };
  if (temp < 26) return { 
    text: 'Óptimo', color: 'rgb(34 197 94)', 
    recommendation: 'Rango ideal para crecimiento radicular y actividad microbiana.'
  };
  return { 
    text: 'Caliente', color: 'rgb(239 68 68)', 
    recommendation: 'Estrés radicular posible. Considerar mulching para reducir temperatura.'
  };
}

export function SoilConditions({ hourly }: Props) {
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().slice(0, 10);
  const idx = hourly.time.findIndex(t => t.startsWith(todayStr) && new Date(t).getHours() === currentHour);
  const i = idx >= 0 ? idx : 0;

  const soilTemp = hourly.soilTemperature[i] ?? 20;
  const soilMoist = hourly.soilMoisture[i] ?? 0.25;
  const moisturePercent = soilMoist * 100;
  
  const waterStress = calculateWaterStressIndex(soilMoist, soilTemp);
  const moistureStatus = getMoistureStatus(soilMoist);
  const tempStatus = getSoilTempStatus(soilTemp);

  // Estimate available water capacity (AWC)
  const fieldCapacity = 0.33; // typical for loamy soil
  const wiltingPoint = 0.12;
  const awc = ((soilMoist - wiltingPoint) / (fieldCapacity - wiltingPoint)) * 100;
  const awcClamped = Math.max(0, Math.min(100, awc));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          Análisis Edáfico
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monitoreo de propiedades físicas del suelo
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Temperature */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Temp. Suelo (6cm)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{soilTemp.toFixed(1)}°C</span>
              <Badge variant="outline" style={{ borderColor: tempStatus.color, color: tempStatus.color, fontSize: '10px' }}>
                {tempStatus.text}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{tempStatus.recommendation}</p>
        </div>

        <div className="h-px bg-border" />

        {/* Soil Moisture */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Humedad Volumétrica (3-9cm)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{moisturePercent.toFixed(1)}%</span>
              <Badge variant="outline" style={{ borderColor: moistureStatus.color, color: moistureStatus.color, fontSize: '10px' }}>
                {moistureStatus.text}
              </Badge>
            </div>
          </div>
          <Progress value={Math.min(moisturePercent * 3, 100)} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Punto marchitez: 12%</span>
            <span>Cap. campo: 33%</span>
          </div>
        </div>

        {/* Available Water Capacity */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Agua Disponible (AWC)</span>
            <span className="font-semibold" style={{ color: awcClamped < 30 ? 'rgb(239 68 68)' : awcClamped < 60 ? 'rgb(234 179 8)' : 'rgb(34 197 94)' }}>
              {awcClamped.toFixed(0)}%
            </span>
          </div>
          <Progress value={awcClamped} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {awcClamped < 30 ? 'Riego necesario — agua fácilmente disponible agotada' 
            : awcClamped < 60 ? 'Monitorear — considerar riego preventivo'
            : 'Agua disponible suficiente para demanda actual'}
          </p>
        </div>

        {/* Water Stress Index */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Índice Estrés Hídrico</span>
          </div>
          <span className="font-semibold" style={{ color: waterStress > 0.6 ? 'rgb(239 68 68)' : waterStress > 0.3 ? 'rgb(249 115 22)' : 'rgb(34 197 94)' }}>
            {(waterStress * 100).toFixed(0)}%
          </span>
        </div>

        {/* Technical note */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            AWC = (θ - θ<sub>wp</sub>) / (θ<sub>fc</sub> - θ<sub>wp</sub>) × 100 | 
            Datos de Open-Meteo ERA5 a 6cm de profundidad
          </p>
        </div>
      </CardContent>
    </Card>
  );
}