import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplets, Thermometer, Wind, Sun, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { getDayOfYear } from '@/lib/solar';
import { calculateET0, calculateWaterStressIndex, shouldTriggerIrrigation } from '@/lib/evapotranspiration';

export function IrrigationAlerts() {
  const { data: weather, isLoading } = useWeather();
  const [soilMoisture, setSoilMoisture] = useState(45); // Simulado, normalmente vendría de sensores
  
  if (isLoading || !weather) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Alertas de Riego
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const dayOfYear = getDayOfYear(new Date());
  const currentTemp = weather.current.temperature;
  const humidity = weather.current.humidity;
  const windSpeed = (weather.current.windSpeed || 10) / 3.6; // km/h a m/s
  
  // Calcular ET0 con datos actuales
  const et0Result = calculateET0({
    tempMax: currentTemp + 3, // Estimación
    tempMin: currentTemp - 5,
    tempMean: currentTemp,
    humidity: humidity,
    windSpeed: windSpeed,
  }, dayOfYear);
  
  // Calcular índice de estrés hídrico
  const stressInfo = calculateWaterStressIndex(
    et0Result.et0,
    soilMoisture,
    currentTemp,
    1.0 // Coeficiente del cultivo (cannabis promedio)
  );
  
  // Verificar si necesita riego
  const irrigationDecision = shouldTriggerIrrigation(
    et0Result.et0,
    soilMoisture,
    currentTemp,
    {
      soilMoistureMin: 30,
      soilMoistureCritical: 20,
      tempMax: 35,
      et0Threshold: 6,
      cropCoefficient: 1.0,
    }
  );
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-700 dark:text-orange-400';
      case 'critical': return 'bg-red-500/20 text-red-700 dark:text-red-400';
      default: return 'bg-muted';
    }
  };
  
  const getStressColor = (status: string) => {
    switch (status) {
      case 'óptimo': return 'hsl(var(--veg-green))';
      case 'leve': return 'hsl(var(--pre-flower-yellow))';
      case 'moderado': return 'hsl(var(--early-flower-orange))';
      case 'severo': return 'hsl(var(--destructive))';
      case 'crítico': return 'hsl(0 100% 40%)';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'urgente': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'alta': return 'bg-orange-500 hover:bg-orange-600 text-white';
      default: return 'bg-primary hover:bg-primary/90';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Alertas de Riego Automático
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Evapotranspiración */}
        <div className="bg-muted/30 rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Evapotranspiración (ET₀)</span>
            <Badge className={getRiskColor(et0Result.riskLevel)}>
              {et0Result.riskLevel === 'low' && 'Baja'}
              {et0Result.riskLevel === 'medium' && 'Moderada'}
              {et0Result.riskLevel === 'high' && 'Alta'}
              {et0Result.riskLevel === 'critical' && 'Crítica'}
            </Badge>
          </div>
          
          <div className="flex items-end gap-1 mb-2">
            <span className="text-2xl font-bold">{et0Result.et0}</span>
            <span className="text-sm text-muted-foreground mb-1">mm/día</span>
          </div>
          
          <p className="text-xs text-muted-foreground mb-3">
            {et0Result.recommendation}
          </p>
          
          {/* Factores que contribuyen */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="flex flex-col items-center gap-1">
              <Thermometer className="h-4 w-4 text-red-400" />
              <Progress value={et0Result.factors.temperature * 100} className="h-1 w-full" />
              <span className="text-muted-foreground">Temp</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-400" />
              <Progress value={et0Result.factors.humidity * 100} className="h-1 w-full" />
              <span className="text-muted-foreground">Hum</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wind className="h-4 w-4 text-gray-400" />
              <Progress value={et0Result.factors.wind * 100} className="h-1 w-full" />
              <span className="text-muted-foreground">Viento</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sun className="h-4 w-4 text-yellow-400" />
              <Progress value={et0Result.factors.radiation * 100} className="h-1 w-full" />
              <span className="text-muted-foreground">Sol</span>
            </div>
          </div>
        </div>
        
        {/* Índice de Estrés Hídrico */}
        <div className="bg-muted/30 rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Índice de Estrés Hídrico</span>
            <span 
              className="text-sm font-semibold"
              style={{ color: getStressColor(stressInfo.status) }}
            >
              {stressInfo.status.toUpperCase()}
            </span>
          </div>
          
          <div className="relative mb-2">
            <Progress 
              value={stressInfo.index} 
              className="h-3"
            />
            <div 
              className="absolute top-0 left-0 h-3 rounded-full transition-all"
              style={{
                width: `${stressInfo.index}%`,
                background: `linear-gradient(90deg, 
                  hsl(var(--veg-green)) 0%, 
                  hsl(var(--pre-flower-yellow)) 40%, 
                  hsl(var(--early-flower-orange)) 60%, 
                  hsl(var(--destructive)) 100%)`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>0 - Óptimo</span>
            <span className="font-medium">{stressInfo.index}/100</span>
            <span>100 - Crítico</span>
          </div>
          
          <p className="text-xs text-muted-foreground">{stressInfo.action}</p>
        </div>
        
        {/* Humedad del Suelo Simulada */}
        <div className="bg-muted/30 rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Humedad del Suelo (simulada)</span>
            <span className="text-sm font-semibold">{soilMoisture}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Seco 0%</span>
            <span>Óptimo 50%</span>
            <span>Saturado 100%</span>
          </div>
        </div>
        
        {/* Decisión de Riego */}
        <div 
          className={`rounded-lg p-3 border ${
            irrigationDecision.shouldIrrigate 
              ? 'bg-orange-500/10 border-orange-500/30' 
              : 'bg-green-500/10 border-green-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            {irrigationDecision.shouldIrrigate ? (
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">
                {irrigationDecision.shouldIrrigate ? 'Riego Recomendado' : 'Sin Necesidad de Riego'}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {irrigationDecision.reason}
              </p>
              
              {irrigationDecision.shouldIrrigate && (
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className={getUrgencyStyle(irrigationDecision.urgency)}
                  >
                    <Droplets className="h-4 w-4 mr-1" />
                    Regar {irrigationDecision.duration} min
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Urgencia: {irrigationDecision.urgency}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Necesidad de Agua */}
        <div className="flex items-center justify-between text-sm p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <span>💧 Necesidad hídrica estimada:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {et0Result.waterNeedLiters} L/m²/día
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
