import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';
import { Moon } from 'lucide-react';

interface MoonPhaseInfo {
    phaseRaw: number; // 0 to 1
    name: string;
    emoji: string;
    tendency: 'Sube' | 'Baja';
    advice: string;
}

// Simple approximation of moon phase based on known synodic month (29.53058770576 days)
// Known new moon reference: Jan 11, 2024, 11:57 UTC
function getMoonPhase(date: Date): MoonPhaseInfo {
    const LUNAR_MONTH = 29.53058770576;
    const LUNAR_MS = LUNAR_MONTH * 24 * 60 * 60 * 1000;

    const refDate = new Date('2024-01-11T11:57:00Z');
    const diffTime = date.getTime() - refDate.getTime();

    // Modulo of total time elapsed over lunar month ms
    const phaseRaw = (diffTime % LUNAR_MS) / LUNAR_MS;
    const phaseCycle = phaseRaw < 0 ? phaseRaw + 1 : phaseRaw; // Handle past dates safely

    let name = "";
    let emoji = "";
    let tendency: 'Sube' | 'Baja' = 'Sube';
    let advice = "";

    if (phaseCycle < 0.03 || phaseCycle > 0.97) {
        name = "Luna Nueva";
        emoji = "🌑";
        tendency = "Sube";
        advice = "Savia concentrada en la raíz. Buen momento para podar raíces o arrancar malas hierbas. Evitar siembra.";
    } else if (phaseCycle < 0.25) {
        name = "Cuarto Creciente";
        emoji = "🌓";
        tendency = "Sube";
        advice = "Savia asciende hacia las hojas. Excelente para podas foliares, siembra de semillas (sobre todo autos) y aplicación de abono de crecimiento.";
    } else if (phaseCycle < 0.47) {
        name = "Creciente Gibosa";
        emoji = "🌔";
        tendency = "Sube";
        advice = "Savia en hojas y tallos altos. Últimos días recomendados para sembrar.";
    } else if (phaseCycle < 0.53) {
        name = "Luna Llena";
        emoji = "🌕";
        tendency = "Baja";
        advice = "Savia concentrada en la copa de la planta. NO podar (riesgo excesivo de sangrado). Excelente momento para cosechar flores (más resina) o aplicar insecticidas preventivos.";
    } else if (phaseCycle < 0.75) {
        name = "Menguante Gibosa";
        emoji = "🌖";
        tendency = "Baja";
        advice = "Savia desciende hacia las raíces. Buen momento para trasplantar o abonar desde el sustrato (enraizantes).";
    } else if (phaseCycle < 0.97) {
        name = "Cuarto Menguante";
        emoji = "🌗";
        tendency = "Baja";
        advice = "Savia muy baja. Fase ideal para hacer esquejes (clones) ya que la planta sufrirá menos estrés hídrico al cortarla.";
    }

    return { phaseRaw: phaseCycle, name, emoji, tendency, advice };
}

export function MoonPhase() {
    const info = getMoonPhase(new Date());

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Moon className="h-5 w-5 text-indigo-400" />
                    Calendario Lunar (Agro)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl" style={{ filter: 'drop-shadow(0px 0px 8px rgba(167, 139, 250, 0.4))' }}>
                        {info.emoji}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{info.name}</h3>
                        <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">
                            Savia: {info.tendency} {info.tendency === 'Sube' ? '⬆️' : '⬇️'}
                        </p>
                    </div>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                        Recomendación de Cultivo hoy:
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        {info.advice}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
