import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';
import { Droplets, Wind, Sun, Snowflake, Zap } from 'lucide-react';
import { CurrentWeather as CurrentWeatherType } from '@/lib/weather';
import { getDayOfYear } from '@/lib/solar';
import { calculateET0 } from '@/lib/evapotranspiration';

interface IrrigationAdvisorProps {
    currentData: CurrentWeatherType;
}

export function IrrigationAdvisor({ currentData }: IrrigationAdvisorProps) {
    const { latitude, longitude } = useSettings();
    const dayOfYear = getDayOfYear(new Date());

    const et0Result = calculateET0(
        {
            tempMax: currentData.temperature + 2, // Estimación simple
            tempMin: currentData.temperature - 2,
            tempMean: currentData.temperature,
            humidity: currentData.humidity,
            windSpeed: currentData.windSpeed / 3.6, // km/h a m/s
        },
        dayOfYear,
        latitude
    );

    const { riskLevel, recommendation, et0, factors } = et0Result;

    const riskMeta = {
        low: { color: 'text-blue-500', message: 'Demanda Baja' },
        medium: { color: 'text-green-500', message: 'Demanda Media' },
        high: { color: 'text-yellow-500', message: 'Demanda Alta' },
        critical: { color: 'text-red-500', message: 'Demanda Crítica' }
    }[riskLevel];

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Asesor de Riego Pro (FAO-56)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-3 mb-4">
                    <div className={`text-4xl font-black tracking-tighter ${riskMeta.color}`}>
                        {et0.toFixed(1)}
                        <span className="text-sm ml-1">mm/día</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground/80 mb-1 leading-tight">
                        {riskMeta.message}
                    </p>
                </div>

                <p className="text-sm mb-4 leading-relaxed">
                    {recommendation}
                </p>

                <div className="space-y-2 border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Factores de Evapotranspiración
                    </p>
                    <div className="grid grid-cols-2 gap-y-2">
                        <div className="flex items-center gap-2 text-xs">
                            <Sun className="h-3 w-3 text-orange-500" />
                            <span>Radiación: {(factors.radiation * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Wind className="h-3 w-3 text-blue-400" />
                            <span>Viento: {(factors.wind * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span>Temp: {(factors.temperature * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span>Déficit Hum: {(factors.humidity * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
