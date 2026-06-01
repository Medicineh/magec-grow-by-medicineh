import { GeneticsType } from '../context/SettingsContext';

export interface PlantPhaseInfo {
    id: string;
    label: string;
    description: string;
    icon: string;
    tip: string;
    characteristics: string[];
    colorClass: string;
    progress: number;
}

export interface GrowthState {
    phase: PlantPhaseInfo;
    isAuto: boolean;
}

export const getBotanyLogic = (
    genetics: GeneticsType,
    sowDate: string | null,
    dayOfYear: number,
    lightHours: number
): GrowthState => {
    const isAuto = genetics === 'Auto';
    const daysSince = sowDate ? Math.ceil(Math.abs(new Date().getTime() - new Date(sowDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Cannabis Model (Photoperiod)
    if (genetics === 'Feminizada') {
        const isLengthening = dayOfYear < 182;
        const vegThreshold = 13.5;
        const flowerThreshold = 12.5;

        if (lightHours >= vegThreshold && isLengthening) {
            return {
                isAuto: false,
                phase: {
                    id: 'vegetativo',
                    label: 'Vegetativo',
                    description: `Vigoroso crecimiento con ${lightHours.toFixed(1)}h de luz.`,
                    icon: '🌿',
                    tip: 'Nitrógeno alto (N). Ratio 3-1-2. Ideal para podas y entrenamiento.',
                    characteristics: ['Crecimiento rápido', 'Internodos largos', 'Hojas grandes'],
                    colorClass: 'text-green-500',
                    progress: ((lightHours - 12) / 2) * 100
                }
            };
        } else if (lightHours >= flowerThreshold) {
            return {
                isAuto: false,
                phase: {
                    id: 'prefloracion',
                    label: 'Pre-floración',
                    description: `Días acortándose (${lightHours.toFixed(1)}h). Inicio de estirón.`,
                    icon: '🌼',
                    tip: 'Hacia Fósforo y Potasio (P-K). Detener podas. Identificar sexo.',
                    characteristics: ['Estiramiento vertical', 'Primeros pistilos', 'Cálices visibles'],
                    colorClass: 'text-yellow-500',
                    progress: ((14 - lightHours) / 2) * 100
                }
            };
        } else if (lightHours >= 11.0) {
            return {
                isAuto: false,
                phase: {
                    id: 'floracion',
                    label: 'Floración Plena',
                    description: `Noches largas (${(24 - lightHours).toFixed(1)}h). Formando cogollos.`,
                    icon: '🌸',
                    tip: 'P-K alto. Humedad <50%. Vigilar hongos en cogollos densos.',
                    characteristics: ['Floración masiva', 'Resina/Tricomas', 'Olor fuerte'],
                    colorClass: 'text-purple-500',
                    progress: ((12.5 - lightHours) / 1.5) * 100
                }
            };
        } else {
            return {
                isAuto: false,
                phase: {
                    id: 'maduracion',
                    label: 'Maduración',
                    description: 'Última fase. Los tricomas están avisando.',
                    icon: '🍯',
                    tip: 'Lavado de raíces. Observar tricomas lechosos/ámbar (70/30).',
                    characteristics: ['Tricomas ámbar', 'Hojas amarilleando', 'Cosecha inminente'],
                    colorClass: 'text-orange-500',
                    progress: 90
                }
            };
        }
    }

    // Tomato Model (Maturity based)
    if (genetics === 'Tomato') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Siembra', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };

        if (daysSince < 14) return { isAuto: false, phase: { id: 'seedling', label: 'Germinación', description: 'Emergiendo.', icon: '🌱', tip: 'Humedad constante.', characteristics: ['Cotiledones'], colorClass: 'text-green-400', progress: (daysSince / 14) * 100 } };
        if (daysSince < 45) return { isAuto: false, phase: { id: 'veg', label: 'Desarrollo Foliar', description: 'Estructura.', icon: '🌿', tip: 'Quitar chupones.', characteristics: ['Tallos vellosos'], colorClass: 'text-green-500', progress: ((daysSince - 14) / 31) * 100 } };
        if (daysSince < 75) return { isAuto: false, phase: { id: 'flower', label: 'Floración', description: 'Cuajado.', icon: '🌼', tip: 'Agitar para polen.', characteristics: ['Flores amarillas'], colorClass: 'text-yellow-500', progress: ((daysSince - 45) / 30) * 100 } };
        return { isAuto: false, phase: { id: 'harvest', label: 'Maduración', description: 'Envero.', icon: '🍅', tip: 'Cosechar selectivo.', characteristics: ['Fruto rojo', 'Aroma'], colorClass: 'text-red-500', progress: 100 } };
    }

    // Aloe Vera Model
    if (genetics === 'Aloe') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 30) return { isAuto: false, phase: { id: 'adapt', label: 'Adaptación', description: 'Enraizando.', icon: '🌵', tip: 'Riego muy escaso.', characteristics: ['Hojas tersas'], colorClass: 'text-green-300', progress: (daysSince / 30) * 100 } };
        if (daysSince < 180) return { isAuto: false, phase: { id: 'growth', label: 'Crecimiento Lento', description: 'Hojas carnosas.', icon: '🎋', tip: 'Mucho sol directo.', characteristics: ['Gel interno'], colorClass: 'text-green-500', progress: ((daysSince - 30) / 150) * 100 } };
        return { isAuto: false, phase: { id: 'mature', label: 'Planta Adulta', description: 'Lista para uso.', icon: '🧪', tip: 'Cortar hojas externas.', characteristics: ['Hijos/Hijuelos'], colorClass: 'text-green-600', progress: 100 } };
    }

    // Papaya Model
    if (genetics === 'Papaya') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Siembra', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 20) return { isAuto: false, phase: { id: 'germ', label: 'Germinación', description: 'Despegando.', icon: '🌱', tip: 'Tierra caliente.', characteristics: ['Tallo frágil'], colorClass: 'text-green-300', progress: (daysSince / 20) * 100 } };
        if (daysSince < 90) return { isAuto: false, phase: { id: 'veg', label: 'Crecimiento Rápido', description: 'Hojas grandes.', icon: '🌴', tip: 'Nitrógeno + Agua.', characteristics: ['Hojas lobuladas'], colorClass: 'text-green-500', progress: ((daysSince - 20) / 70) * 100 } };
        if (daysSince < 180) return { isAuto: false, phase: { id: 'flower', label: 'Floración', description: 'Sexo visible.', icon: '🌼', tip: 'Proteger del viento.', characteristics: ['Flores en axilas'], colorClass: 'text-yellow-500', progress: ((daysSince - 90) / 90) * 100 } };
        return { isAuto: false, phase: { id: 'fruit', label: 'Fructificación', description: 'Engorde.', icon: '🥭', tip: 'Cuidado con calima.', characteristics: ['Fruta verde/naranja'], colorClass: 'text-orange-500', progress: 100 } };
    }

    // Mango Model
    if (genetics === 'Mango') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 60) return { isAuto: false, phase: { id: 'estb', label: 'Establecimiento', description: 'Asentando raíces.', icon: '🌳', tip: 'Humedad constante.', characteristics: ['Hojas rojizas'], colorClass: 'text-green-300', progress: (daysSince / 60) * 100 } };
        if (daysSince < 365) return { isAuto: false, phase: { id: 'veg', label: 'Desarrollo Estructural', description: 'Copa ancha.', icon: '🌲', tip: 'Formar estructura.', characteristics: ['Brotes nuevos'], colorClass: 'text-green-500', progress: ((daysSince - 60) / 305) * 100 } };
        return { isAuto: false, phase: { id: 'mature', label: 'Ciclo Reproductivo', description: 'Flor y fruto.', icon: '🥭', tip: 'Potasio alto.', characteristics: ['Panículas'], colorClass: 'text-yellow-600', progress: 100 } };
    }

    // Basil (Albahaca) Model
    if (genetics === 'Basil') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Siembra', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 10) return { isAuto: false, phase: { id: 'germ', label: 'Germinación', description: 'Rápida.', icon: '🌱', tip: 'Mucha luz.', characteristics: ['Cotiledones'], colorClass: 'text-green-300', progress: (daysSince / 10) * 100 } };
        if (daysSince < 40) return { isAuto: false, phase: { id: 'growth', label: 'Crecimiento Foliar', description: 'Aromático.', icon: '🌿', tip: 'Quitar flores.', characteristics: ['Poda apical'], colorClass: 'text-green-500', progress: ((daysSince - 10) / 30) * 100 } };
        return { isAuto: false, phase: { id: 'harvest', label: 'Cosecha Continua', description: 'Pesto time.', icon: '🥗', tip: 'Cortar por nudos.', characteristics: ['Gran aroma'], colorClass: 'text-green-600', progress: 100 } };
    }

    // Mint (Menta) Model
    if (genetics === 'Mint') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 15) return { isAuto: false, phase: { id: 'root', label: 'Enraizamiento', description: 'Expansión.', icon: '🌱', tip: 'Sustrato húmedo.', characteristics: ['Estolones'], colorClass: 'text-green-300', progress: (daysSince / 15) * 100 } };
        return { isAuto: false, phase: { id: 'inv', label: 'Expansión/Cosecha', description: 'Muy invasiva.', icon: '🌿', tip: 'Controlar en tiesto.', characteristics: ['Raíces rápidas'], colorClass: 'text-green-500', progress: 100 } };
    }

    // Lavender (Lavanda) Model
    if (genetics === 'Lavender') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 45) return { isAuto: false, phase: { id: 'estb', label: 'Establecimiento', description: 'Adaptación.', icon: '🌿', tip: 'Drenaje perfecto.', characteristics: ['Hojas grisáceas'], colorClass: 'text-gray-400', progress: (daysSince / 45) * 100 } };
        if (daysSince < 150) return { isAuto: false, phase: { id: 'pre', label: 'Pre-floración', description: 'Formando espigas.', icon: '🌾', tip: 'Pleno sol.', characteristics: ['Tallos largos'], colorClass: 'text-purple-300', progress: ((daysSince - 45) / 105) * 100 } };
        return { isAuto: false, phase: { id: 'bloom', label: 'Floración', description: 'Aroma relax.', icon: '🌸', tip: 'Secar flores.', characteristics: ['Flores púrpuras'], colorClass: 'text-purple-500', progress: 100 } };
    }

    // Rosemary (Romero) Model
    if (genetics === 'Rosemary') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 45) return { isAuto: false, phase: { id: 'adapt', label: 'Adaptación', description: 'Enraizando.', icon: '🌱', tip: 'Riego moderado y buen drenaje.', characteristics: ['Brotes suaves'], colorClass: 'text-green-300', progress: (daysSince / 45) * 100 } };
        return { isAuto: false, phase: { id: 'stable', label: 'Mantenimiento', description: 'Aromática resistente.', icon: '🌿', tip: 'Poda ligera para compactar.', characteristics: ['Tallos leñosos'], colorClass: 'text-green-600', progress: 100 } };
    }

    if (genetics === 'Lemon') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 120) return { isAuto: false, phase: { id: 'juvenile', label: 'Crecimiento', description: 'Formando copa.', icon: '🌳', tip: 'Evita vientos fuertes.', characteristics: ['Hojas nuevas'], colorClass: 'text-green-500', progress: (daysSince / 120) * 100 } };
        return { isAuto: false, phase: { id: 'productive', label: 'Producción', description: 'Flor y fruto.', icon: '🍋', tip: 'Aporta potasio en floración.', characteristics: ['Azahar', 'Frutos en engorde'], colorClass: 'text-yellow-500', progress: 100 } };
    }

    if (genetics === 'Strawberry') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Plantación', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 25) return { isAuto: false, phase: { id: 'root', label: 'Enraizamiento', description: 'Agarrando sustrato.', icon: '🌱', tip: 'Mantén humedad uniforme.', characteristics: ['Hojas pequeñas'], colorClass: 'text-green-300', progress: (daysSince / 25) * 100 } };
        if (daysSince < 70) return { isAuto: false, phase: { id: 'flower', label: 'Floración', description: 'Formando flores blancas.', icon: '🌼', tip: 'Evita mojar flores por la tarde.', characteristics: ['Botones florales'], colorClass: 'text-pink-400', progress: ((daysSince - 25) / 45) * 100 } };
        return { isAuto: false, phase: { id: 'fruit', label: 'Fructificación', description: 'Fresas en maduración.', icon: '🍓', tip: 'Recolecta cada 2-3 días.', characteristics: ['Fruto rojo'], colorClass: 'text-red-500', progress: 100 } };
    }

    if (genetics === 'Potato') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Siembra', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 25) return { isAuto: false, phase: { id: 'sprout', label: 'Brotación', description: 'Saliendo a superficie.', icon: '🌱', tip: 'Aporca al primer crecimiento.', characteristics: ['Tallos cortos'], colorClass: 'text-green-400', progress: (daysSince / 25) * 100 } };
        if (daysSince < 70) return { isAuto: false, phase: { id: 'tuber', label: 'Tubérculo', description: 'Engorde bajo tierra.', icon: '🥔', tip: 'Riego regular sin encharcar.', characteristics: ['Follaje denso'], colorClass: 'text-amber-500', progress: ((daysSince - 25) / 45) * 100 } };
        return { isAuto: false, phase: { id: 'harvest', label: 'Cosecha', description: 'Listas para extracción.', icon: '🧺', tip: 'Cosecha con suelo seco.', characteristics: ['Hojas secándose'], colorClass: 'text-orange-500', progress: 100 } };
    }

    if (genetics === 'Lettuce') {
        if (!sowDate) return { isAuto: false, phase: { id: 'wait', label: 'Esperando Siembra', description: 'Introduce fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 12) return { isAuto: false, phase: { id: 'germ', label: 'Germinación', description: 'Muy rápida.', icon: '🌱', tip: 'Sombra ligera al mediodía.', characteristics: ['Plántulas'], colorClass: 'text-green-300', progress: (daysSince / 12) * 100 } };
        if (daysSince < 45) return { isAuto: false, phase: { id: 'leaf', label: 'Formación de hojas', description: 'Crecimiento tierno.', icon: '🥬', tip: 'Riego frecuente y corto.', characteristics: ['Roseta densa'], colorClass: 'text-green-500', progress: ((daysSince - 12) / 33) * 100 } };
        return { isAuto: false, phase: { id: 'harvest', label: 'Punto de corte', description: 'Óptima para cosecha.', icon: '✂️', tip: 'Cosecha al amanecer.', characteristics: ['Hojas compactas'], colorClass: 'text-emerald-500', progress: 100 } };
    }

    // Auto Model
    if (isAuto) {
        if (!sowDate) return { isAuto: true, phase: { id: 'wait', label: 'Esperando Fecha', description: 'Pon fecha.', icon: '⏳', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
        if (daysSince < 20) return { isAuto: true, phase: { id: 'veg_auto', label: 'Vegetativo (Auto)', description: 'Inicio rápido.', icon: '🌱', tip: 'No estresar.', characteristics: ['Primeras hojas'], colorClass: 'text-green-500', progress: (daysSince / 20) * 100 } };
        if (daysSince < 45) return { isAuto: true, phase: { id: 'pre_auto', label: 'Prefloración (Auto)', description: 'Estirón inicial.', icon: '🌼', tip: 'Cambio a PK.', characteristics: ['Primeros pelos'], colorClass: 'text-yellow-500', progress: ((daysSince - 20) / 25) * 100 } };
        return { isAuto: true, phase: { id: 'flow_auto', label: 'Floración (Auto)', description: 'Engordando.', icon: '🌸', tip: 'Mucho sol.', characteristics: ['Cogollos'], colorClass: 'text-purple-500', progress: ((daysSince - 45) / 30) * 100 } };
    }

    // Fallback
    return { isAuto: false, phase: { id: 'error', label: 'Unknown', description: 'Error', icon: '❓', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 } };
};
