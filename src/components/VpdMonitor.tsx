import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';
import { AlertTriangle, Droplets, ThermometerSun, ShieldAlert } from 'lucide-react';

interface VpdMonitorProps {
    temperature: number;
    humidity: number;
}

/**
 * Calculates Vapor Pressure Deficit (VPD) in kPa
 * using the Tetens formula for saturated vapor pressure.
 */
function calculateVPD(t: number, h: number): number {
    // Saturated Vapor Pressure (SVP) in kPa
    const svp = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
    // Actual Vapor Pressure (AVP)
    const avp = svp * (h / 100);
    return svp - avp;
}

export function VpdMonitor({ temperature, humidity }: VpdMonitorProps) {
    const { genetics } = useSettings();
    const vpd = calculateVPD(temperature, humidity);

    // VPD Stages (kPa) for Cannabis (Approximated for outdoors)
    // 0.4 - 0.8: Clones / Seedlings
    // 0.8 - 1.2: Vegetative
    // 1.2 - 1.5: Flowering

    let riskLevel = 'Bajo';
    let riskColor = 'text-green-500';
    let bgColor = 'bg-green-500/10';
    let borderColor = 'border-green-500/20';
    let message = 'Transpiración de la planta en niveles ideales.';
    let diseaseWarning = null;

    if (vpd < 0.4) {
        riskLevel = 'Alto (Riesgo Fúngico)';
        riskColor = 'text-blue-500';
        bgColor = 'bg-blue-500/10';
        borderColor = 'border-blue-500/20';
        message = 'VPD muy bajo. La planta no puede transpirar por exceso de humedad.';
        diseaseWarning = "Peligro: Alta probabilidad de Oídio o Botrytis (Moho gris). Aumentar ventilación si es posible.";
    } else if (vpd > 1.6) {
        riskLevel = 'Alto (Estrés Hídrico)';
        riskColor = 'text-red-500';
        bgColor = 'bg-red-500/10';
        borderColor = 'border-red-500/20';
        message = 'VPD muy alto. La planta cerrará estomas para no deshidratarse (frenando crecimiento).';
        diseaseWarning = "Peligro: Clima muy propicio para plagas como la Araña Roja. Aumentar frecuencia de riego.";
    } else if (vpd >= 0.4 && vpd <= 0.8) {
        message = 'Rango ideal (0.4-0.8) para Esquejes y Plantas Jóvenes.';
    } else if (vpd > 0.8 && vpd <= 1.2) {
        message = 'Rango ideal (0.8-1.2) para la fase Vegetativa.';
    } else if (vpd > 1.2 && vpd <= 1.6) {
        message = 'Rango ideal (1.2-1.6) para fase de Floración.';
    }

    // Pointer position for the visual gauge (cap between 0 and 2.5)
    const pointerPercentage = Math.min(Math.max((vpd / 2.5) * 100, 0), 100);

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    Asistente VPD y Plagas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <div className="text-3xl font-bold flex items-baseline gap-1">
                            {vpd.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kPa</span>
                        </div>
                        <p className={`text-sm font-medium ${riskColor}`}>{riskLevel}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-end gap-1"><ThermometerSun className="h-3 w-3" /> {temperature}°C</div>
                        <div className="flex justify-end gap-1"><Droplets className="h-3 w-3" /> {humidity}%</div>
                    </div>
                </div>

                {/* Visual Gauge */}
                <div className="relative h-4 w-full rounded-full overflow-hidden flex mb-2">
                    {/* Ranges matching cannabis needs */}
                    <div className="h-full bg-blue-400" style={{ width: '16%' }} title="< 0.4 (Peligro)" />
                    <div className="h-full bg-teal-400" style={{ width: '16%' }} title="0.4 - 0.8 (Esquejes)" />
                    <div className="h-full bg-green-500" style={{ width: '16%' }} title="0.8 - 1.2 (Vegetativo)" />
                    <div className="h-full bg-yellow-400" style={{ width: '16%' }} title="1.2 - 1.6 (Floración)" />
                    <div className="h-full bg-red-500" style={{ width: '36%' }} title="> 1.6 (Peligro)" />
                    {/* Pointer */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-foreground transform -translate-x-1/2 rounded-full border border-background shadow-md transition-all duration-700"
                        style={{ left: `${pointerPercentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground mb-4">
                    <span>0.0</span>
                    <span>1.0</span>
                    <span>2.0+</span>
                </div>

                {/* Messages */}
                <div className={`p-3 rounded-lg border ${bgColor} ${borderColor} space-y-2`}>
                    <p className="text-sm">{message}</p>
                    {diseaseWarning && (
                        <div className="flex gap-2 items-start mt-2 text-sm font-medium">
                            <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${riskColor}`} />
                            <p className={riskColor}>{diseaseWarning}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
