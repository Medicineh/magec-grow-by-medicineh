import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/context/SettingsContext';
import { Scissors, Droplets, Thermometer, Wind, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

const STEPS = [
    {
        title: 'Selección',
        description: 'Elige una rama lateral sana y vigorosa de unos 10-15cm. Evita ramas con flores.',
        icon: <Scissors className="h-6 w-6 text-yellow-500" />,
        detail: 'El nudo debe estar bien formado. Una planta madre bien hidratada el día anterior es clave.'
    },
    {
        title: 'El Corte',
        description: 'Corta a 45 grados justo debajo de un nudo. Usa una cuchilla esterilizada.',
        icon: <Scissors className="h-6 w-6 text-red-500" />,
        detail: 'Introduce el corte inmediatamente en agua para evitar embolias de aire en el tallo.'
    },
    {
        title: 'Hormonas',
        description: 'Aplica gel de enraizamiento en la base del tallo (unos 2cm).',
        icon: <Droplets className="h-6 w-6 text-blue-400" />,
        detail: 'No sumerjas el esqueje directamente en el bote; usa un recipiente aparte para evitar contaminar el gel.'
    },
    {
        title: 'Sustrato',
        description: 'Inserta en jiffy, lana de roca o sustrato ligero previamente hidratado.',
        icon: <Droplets className="h-6 w-6 text-green-500" />,
        detail: 'Presiona suavemente el sustrato alrededor del tallo para asegurar contacto y eliminar aire.'
    },
    {
        title: 'Humedad',
        description: 'Mantén en propagador con humedad >80% y luz suave indirecta.',
        icon: <Thermometer className="h-6 w-6 text-purple-500" />,
        detail: 'Pulveriza las paredes del propagador, no las hojas directamente para evitar hongos.'
    }
];

export function CuttingsGuide() {
    const { genetics } = useSettings();
    const { data: weather } = useWeather();
    const [currentStep, setCurrentStep] = useState(0);

    const isAuto = genetics === 'Auto';

    const nextStep = () => setCurrentStep((prev) => (prev + 1) % STEPS.length);
    const prevStep = () => setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);

    const getClimateAdvice = () => {
        if (!weather) return null;
        const { temperature, humidity, windSpeed } = weather.current;

        if (windSpeed > 30) return {
            type: 'danger',
            message: 'Viento fuerte detectado. Es vital usar propagador cerrado para evitar deshidratación flash.',
            icon: <Wind className="h-4 w-4" />
        };
        if (humidity < 40) return {
            type: 'warning',
            message: 'Ambiente muy seco. Pulveriza el propagador con más frecuencia hoy.',
            icon: <Droplets className="h-4 w-4" />
        };
        if (temperature > 28) return {
            type: 'warning',
            message: 'Calor elevado. Mantén los esquejes en la zona más fresca y sombreada.',
            icon: <Thermometer className="h-4 w-4" />
        };
        return {
            type: 'success',
            message: 'Condiciones actuales estables para esquejar bajo protección.',
            icon: <CheckCircle2 className="h-4 w-4" />
        };
    };

    const advice = getClimateAdvice();
    const step = STEPS[currentStep];

    return (
        <Card className="col-span-full lg:col-span-1 overflow-hidden border-t-4 border-t-yellow-500">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Scissors className="h-5 w-5 text-yellow-500" />
                            Guía de Esquejes
                        </CardTitle>
                        <CardDescription>Multiplica tus plantas con éxito</CardDescription>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevStep}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextStep}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 relative">
                {/* Autoflower Warning Overlay */}
                {isAuto && (
                    <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                        <div className="space-y-4 max-w-xs animate-in fade-in zoom-in duration-300">
                            <div className="bg-red-500/10 p-3 rounded-full w-fit mx-auto border border-red-500/20">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="font-bold text-lg text-red-600">Mala Idea: Esquejes en Auto</h3>
                            <p className="text-sm text-balance leading-relaxed">
                                A diferencia de las fotodependientes, las plantas <strong>autoflorecientes</strong> tienen un ciclo de vida limitado y predeterminado.
                            </p>
                            <div className="bg-muted p-3 rounded-lg text-xs text-left border-l-2 border-red-500">
                                <strong>Razonamiento:</strong> Su "reloj biológico" no se detiene. Cualquier estrés (como podas o cortes) detiene el crecimiento vegetativo. Como no tienen tiempo para recuperarse antes de florecer, acabarás con plantas diminutas y una cosecha ínfima.
                            </div>
                            <p className="text-xs font-medium text-muted-foreground italic">
                                Es mejor dejar que las automáticas crezcan libremente y sin estrés.
                            </p>
                        </div>
                    </div>
                )}

                {/* Climate Context Alert */}
                {advice && !isAuto && (
                    <div className={`p-3 rounded-lg flex gap-2 items-start text-xs border ${advice.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-600' :
                        advice.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' :
                            'bg-green-500/10 border-green-500/20 text-green-600'
                        }`}>
                        <span className="mt-0.5">{advice.icon}</span>
                        <p className="font-medium">{advice.message}</p>
                    </div>
                )}

                {/* Step Content */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50 relative">
                    <div className="absolute -top-3 -left-3 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        PASO {currentStep + 1}
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-card rounded-xl shadow-inner ring-1 ring-border/50">
                            {step.icon}
                        </div>
                        <h3 className="font-bold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm font-medium mb-2">{step.description}</p>
                    <div className="p-3 bg-background/50 rounded-lg text-xs text-muted-foreground leading-relaxed italic border-l-2 border-yellow-500/50">
                        {step.detail}
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-1.5 pt-1">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-yellow-500' : 'w-1.5 bg-muted'}`}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
