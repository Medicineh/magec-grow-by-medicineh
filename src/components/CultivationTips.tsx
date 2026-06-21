import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { getPlantDailyTip, getPlantRandomTip, Tip } from '@/lib/tips';
import { useSettings } from '@/context/SettingsContext';
import { Lightbulb, Info, BookOpen, RefreshCw } from 'lucide-react';

const CATEGORY_CONFIG = {
    consejo: { label: 'Consejo de Cultivo', icon: Lightbulb, colorClass: 'bg-amber-500/20 text-amber-500', barClass: 'bg-amber-500/40' },
    curiosidad: { label: 'Curiosidad Local', icon: Info, colorClass: 'bg-blue-500/20 text-blue-500', barClass: 'bg-blue-500/40' },
    guia: { label: 'Guía Práctica', icon: BookOpen, colorClass: 'bg-emerald-500/20 text-emerald-500', barClass: 'bg-emerald-500/40' },
} as const;

const CultivationTips: React.FC = () => {
    const { genetics } = useSettings();
    const [tip, setTip] = useState<Tip>(() => getPlantDailyTip(genetics));
    const [animate, setAnimate] = useState(false);
    const [isRotating, setIsRotating] = useState(false);

    const rotateTip = () => {
        setIsRotating(true);
        setAnimate(true);
        setTimeout(() => {
            setTip(getPlantRandomTip(genetics));
            setAnimate(false);
            setTimeout(() => setIsRotating(false), 300);
        }, 300);
    };

    const config = CATEGORY_CONFIG[tip.category];
    const Icon = config.icon;

    return (
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 ring-1 ring-white/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${config.colorClass}`}>
                        <Icon size={18} className={tip.category === 'consejo' ? 'animate-pulse' : ''} />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight">
                        {config.label}
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={rotateTip}
                    disabled={isRotating}
                    className="h-8 w-8 hover:bg-primary/20 hover:rotate-180 transition-all duration-500"
                >
                    <RefreshCw size={14} className={`${isRotating ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>

            <CardContent className="min-h-[130px] flex flex-col justify-center relative">
                <div className={`transition-all duration-300 transform ${animate ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} flex flex-col gap-2`}>
                    <div className="flex items-start gap-3">
                        <span className="text-4xl filter drop-shadow-md select-none transform hover:scale-110 transition-transform duration-300">
                            {tip.icon}
                        </span>
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground/90 leading-tight text-sm uppercase tracking-wider opacity-60">
                                {tip.title}
                            </h4>
                            <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-medium">
                                {tip.content}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <div className="h-1 w-full bg-muted/20 relative overflow-hidden">
                <div className={`h-full absolute left-0 top-0 w-full animate-tip-progress ${config.barClass}`} />
            </div>
        </Card>
    );
};

export default CultivationTips;
