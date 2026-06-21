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

// ---------------------------------------------------------------------------
// Data-driven phase definitions
// ---------------------------------------------------------------------------

interface PhaseSpec {
    id: string;
    label: string;
    icon: string;
    colorClass: string;
    characteristics: string[];
    daysFrom: number;
    daysTo: number | null; // null = open-ended final phase
    description: string;
    tip: string;
}

interface PlantSpec {
    waitLabel: string;
    waitDesc: string;
    phases: PhaseSpec[];
}

const PLANTS: Partial<Record<GeneticsType, PlantSpec>> = {

    Tomato: {
        waitLabel: 'Esperando Siembra / Trasplante',
        waitDesc: 'Introduce la fecha de siembra o trasplante para ver la fase actual.',
        phases: [
            {
                id: 'seedling', daysFrom: 0, daysTo: 14,
                label: 'Germinación', icon: '🌱', colorClass: 'text-green-400',
                description: 'Primeros días tras la siembra. La radícula rompe la testa y los cotiledones emergen. Temperatura ideal 22-26 °C con humedad constante.',
                tip: 'Usa cubierta transparente para mantener >85 % de humedad. En Lanzarote el viento puede secar la capa superficial en minutos: no dejes secar el semillero.',
                characteristics: ['Cotiledones emergiendo', 'Hipocótilo visible', 'Sin hojas verdaderas aún'],
            },
            {
                id: 'early_veg', daysFrom: 14, daysTo: 40,
                label: 'Plántula', icon: '🪴', colorClass: 'text-green-400',
                description: 'Aparecen las primeras hojas verdaderas. Las raíces comienzan a explorar el sustrato. Fase sensible al exceso de riego y al damping-off.',
                tip: 'Riega por capilaridad si es posible. Fertilización suave (N:P:K 2-1-1). Protege del viento directo del Alisio con malla o cristal.',
                characteristics: ['Primeras hojas verdaderas', 'Tallo fino y peloso', 'Crecimiento lento pero constante'],
            },
            {
                id: 'veg', daysFrom: 40, daysTo: 75,
                label: 'Desarrollo Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'Crecimiento rápido de follaje y raíces. Momento de apuntalar y eliminar chupones para concentrar energía en los tallos principales.',
                tip: 'Elimina chupones (brotes axilares) semanalmente. Tutora los tallos con caña. Incrementa gradualmente la fertilización nitrogenada.',
                characteristics: ['Tallos vellosos y robustos', 'Hojas lobuladas grandes', 'Chupones en axilas', 'Primer racimo floral al final de fase'],
            },
            {
                id: 'flower', daysFrom: 75, daysTo: 110,
                label: 'Floración y Cuajado', icon: '🌼', colorClass: 'text-yellow-500',
                description: 'Las flores amarillas se abren y necesitan polinización. El calor >32 °C o el frío <10 °C abortan las flores y reducen la cosecha.',
                tip: 'Agita los racimos florales a media mañana para favorecer la autopolinización. Cambia a fertilizante P-K alto. Mantén humedad <70 % para evitar Botrytis.',
                characteristics: ['Flores amarillas en racimos', 'Polen visible en anteras', 'Primeros frutos verdes', 'Olor característico en hojas'],
            },
            {
                id: 'fruit', daysFrom: 110, daysTo: 150,
                label: 'Engorde del Fruto', icon: '🍈', colorClass: 'text-orange-400',
                description: 'Los frutos cuajados crecen y acumulan azúcares. El riego consistente es crítico para evitar el rajado y la podredumbre apical (BER).',
                tip: 'Riego uniforme sin oscilaciones bruscas. Aplica Calcio foliar si aparece podredumbre apical. Elimina hojas viejas bajas para mejorar la ventilación.',
                characteristics: ['Frutos verdes en crecimiento', 'Tallos arqueados por el peso', 'Hojas inferiores amarilleando'],
            },
            {
                id: 'harvest', daysFrom: 150, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🍅', colorClass: 'text-red-500',
                description: 'Envero en marcha: el fruto cambia de verde a su color definitivo. Cosecha selectiva cada 2-3 días para estimular la producción continua.',
                tip: 'Cosecha cuando el fruto cede ligeramente a la presión. En Canarias la temporada puede extenderse 8-10 meses con variedades indeterminadas.',
                characteristics: ['Fruto con viraje de color', 'Aroma intenso al frotar la piel', 'Cáliz seco en frutos maduros', 'Piel brillante y firme'],
            },
        ],
    },

    Pepper: {
        waitLabel: 'Esperando Trasplante',
        waitDesc: 'Introduce la fecha de trasplante del pimiento para ver su fase.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 21,
                label: 'Establecimiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'La planta trasplantada adapta sus raíces al nuevo sustrato. Puede mostrar languidez los primeros días (shock de trasplante), es normal.',
                tip: 'No fertilices los primeros 10 días. Riega con agua templada. Protege del sol directo intenso las dos primeras semanas con malla de sombreo.',
                characteristics: ['Posible languidez inicial', 'Hojas firmes al recuperarse', 'Sin nuevo crecimiento aún'],
            },
            {
                id: 'veg', daysFrom: 21, daysTo: 65,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'Desarrollo activo de tallos y follaje. El pimiento forma su estructura básica en "Y" con ramificaciones laterales. Es el momento de podar para fortalecer.',
                tip: 'Deja solo 2-3 tallos principales eliminando el resto en la horquilla inicial. N:P:K 3-1-2. Tutora si el viento Alisio es frecuente en tu zona.',
                characteristics: ['Hojas anchas y brillantes', 'Tallo robusto en ramificación', 'Estructura en "Y" visible', 'Crecimiento de 1-2 cm/día en verano'],
            },
            {
                id: 'flower', daysFrom: 65, daysTo: 100,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Flores blancas solitarias aparecen en cada horquilla. Las primeras 2-3 flores pueden eliminarse para que la planta desarrolle más estructura antes de fructificar.',
                tip: 'Cambia a N:P:K 1-3-2 al aparecer las primeras flores. Evita temperaturas nocturnas <15 °C que abortan el cuaje. La calima seca puede secar el estigma.',
                characteristics: ['Flores blancas solitarias en horquillas', 'Botones florales visibles', 'Primer cuaje al final de fase'],
            },
            {
                id: 'fruit_dev', daysFrom: 100, daysTo: 140,
                label: 'Desarrollo del Fruto', icon: '🫑', colorClass: 'text-green-600',
                description: 'Los pimientos jóvenes crecen en las horquillas. El calor excesivo (>35 °C) puede provocar caída de flores y frutos pequeños.',
                tip: 'Riego uniforme para evitar BER (podredumbre apical). Aporta Calcio foliar. En días de calima protege con malla de sombreo del 30-40 %.',
                characteristics: ['Frutos verdes en crecimiento', 'Piel firme y brillante', 'Aumento de peso visible cada semana'],
            },
            {
                id: 'harvest', daysFrom: 140, daysTo: null,
                label: 'Maduración', icon: '🌶️', colorClass: 'text-red-500',
                description: 'Los pimientos alcanzan su tamaño final y comienzan el viraje de color. Puedes cosechar en verde (más crujiente) o esperar al color final (más dulce o picante).',
                tip: 'Cosecha con tijera limpia para no dañar la planta. El pimiento no madura bien fuera de la planta. Un frío suave de otoño intensifica el picor en variedades picantes.',
                characteristics: ['Viraje de color (verde→rojo/amarillo)', 'Piel más suave al tacto', 'Aroma concentrado', 'Planta sigue produciendo nuevas flores'],
            },
        ],
    },

    Aloe: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha en que plantaste o separaste el hijuelo de aloe.',
        phases: [
            {
                id: 'adapt', daysFrom: 0, daysTo: 45,
                label: 'Adaptación y Enraizamiento', icon: '🌵', colorClass: 'text-green-300',
                description: 'El aloe recién plantado o separado forma nuevas raíces. Las hojas pueden parecer un poco menos turgentes; es completamente normal. No riegues en exceso.',
                tip: 'Espera 10-14 días desde el trasplante antes del primer riego. El aloe muere antes de sed que de encharcamiento. Tierra con >50 % de perlita o arena volcánica gruesa.',
                characteristics: ['Hojas firmes sin crecimiento visible', 'Base estabilizándose en sustrato', 'Sin nuevos brotes aún'],
            },
            {
                id: 'growth', daysFrom: 45, daysTo: 180,
                label: 'Crecimiento Activo', icon: '🎋', colorClass: 'text-green-500',
                description: 'Aparecen nuevas hojas desde el centro de la roseta. El crecimiento es lento: cada hoja tarda semanas. Las hojas van acumulando gel interior.',
                tip: 'Riego cada 15-21 días en verano, cada 30-45 días en invierno. El sol directo canario es ideal. El picón volcánico de Lanzarote ofrece drenaje y retención de humedad nocturna perfectos.',
                characteristics: ['Nuevas hojas desde el centro', 'Hojas externas más maduras', 'Gel visible en corte transversal', 'Color verde intenso con borde serrado'],
            },
            {
                id: 'mid_mature', daysFrom: 180, daysTo: 365,
                label: 'Madurez Intermedia', icon: '🌱', colorClass: 'text-green-500',
                description: 'La planta establece una roseta completa con 12-20 hojas. Empiezan a aparecer los primeros hijuelos en la base. Las hojas externas ya contienen gel utilizable.',
                tip: 'Puedes empezar a cosechar las hojas más externas y bajas. Córtalas por la base con cuchillo limpio. No cortes más de 1-2 hojas a la vez para no debilitar la planta.',
                characteristics: ['Roseta completa (12-20 hojas)', 'Primeros hijuelos en la base', 'Hojas externas con gel maduro', 'Posible tallo floral en primavera'],
            },
            {
                id: 'adult', daysFrom: 365, daysTo: null,
                label: 'Planta Adulta', icon: '🧪', colorClass: 'text-green-600',
                description: 'El aloe está completamente establecido y produce hijuelos de forma regular. El gel de las hojas adultas tiene mayor concentración de principios activos.',
                tip: 'Separa los hijuelos cuando tengan 10-15 cm para multiplicar. El aloe adulto sobrevive meses sin riego en clima canario. Puede florecer con tallo naranja en primavera.',
                characteristics: ['Múltiples hijuelos productivos', 'Hojas de 40-60 cm de largo', 'Gel abundante y denso', 'Inflorescencia naranja en primavera'],
            },
        ],
    },

    Papaya: {
        waitLabel: 'Esperando Siembra',
        waitDesc: 'Introduce la fecha de siembra para ver la fase de tu papaya.',
        phases: [
            {
                id: 'germ', daysFrom: 0, daysTo: 20,
                label: 'Germinación', icon: '🌱', colorClass: 'text-green-300',
                description: 'Las semillas de papaya germinan en 2-3 semanas con temperatura mínima de 20 °C, ideal 25-30 °C. Muy sensible al encharcamiento en esta etapa.',
                tip: 'Siembra en semillero a 1 cm de profundidad. Cubre con plástico para mantener humedad. Trasplanta solo cuando tenga 4-6 hojas verdaderas.',
                characteristics: ['Cotiledones redondeados', 'Hipocótilo fino y delicado', 'Sensible al encharcamiento'],
            },
            {
                id: 'juvenile', daysFrom: 20, daysTo: 90,
                label: 'Crecimiento Juvenil', icon: '🌴', colorClass: 'text-green-400',
                description: 'Tras el trasplante la papaya crece muy rápido en clima cálido canario. Las hojas palmadas grandes aparecen rápidamente. El tallo suculento es sensible al viento.',
                tip: 'Tutora con caña el primer mes. Nitrógeno alto. Protege del viento Alisio con malla o muro de piedra seca. Riega con más frecuencia que otras tropicales.',
                characteristics: ['Hojas palmadas grandes', 'Tallo verde suculento', 'Crecimiento muy rápido (2-4 cm/día en verano)'],
            },
            {
                id: 'veg', daysFrom: 90, daysTo: 200,
                label: 'Desarrollo Vegetativo Avanzado', icon: '🌴', colorClass: 'text-green-500',
                description: 'La papaya alcanza su altura definitiva. El sexo de la planta se determina en las flores axilares: hermafrodita (autofértil), hembra o macho (no fructifica).',
                tip: 'Flores tubulares cortas = hermafrodita (ideal). Flores globosas = hembra (necesita macho). Flores en racimos largos = macho. Deja 1 macho por cada 10 hembras.',
                characteristics: ['Altura 1.5-3 m', 'Hojas lobuladas de 50-70 cm', 'Flores axilares visibles', 'Determinación del sexo posible'],
            },
            {
                id: 'flower', daysFrom: 200, daysTo: 300,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Las flores se abren y requieren polinización. El frío nocturno <15 °C aborta la fecundación y produce frutos deformes. En Lanzarote el clima costero es favorable.',
                tip: 'Cubre la planta con velo de invernadero en noches frías de invierno. El viento favorece la polinización de las hermafroditas. No elimines hojas durante esta fase.',
                characteristics: ['Flores axilares abiertas', 'Frutos jóvenes cuajando', 'Olor dulce suave', 'Planta en su máxima altura'],
            },
            {
                id: 'fruit', daysFrom: 300, daysTo: null,
                label: 'Fructificación', icon: '🥭', colorClass: 'text-orange-400',
                description: 'Los frutos engordando forman racimos en el tronco cerca de las hojas. Tardan 4-6 meses en madurar desde el cuaje. El color cambia de verde a amarillo/naranja.',
                tip: 'La calima (aire seco y polvoriento) puede provocar caída de frutos: riega abundantemente durante episodios de calima. Cosecha cuando la base del fruto vira a amarillo.',
                characteristics: ['Frutos en el tronco', 'Verde → amarillo en maduración', 'Olor dulce al acercar la nariz', 'Látex blanco al cortar en verde'],
            },
        ],
    },

    Mango: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha en que trasplantaste o adquiriste el mango.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 90,
                label: 'Establecimiento', icon: '🌳', colorClass: 'text-green-300',
                description: 'Los primeros 3 meses son críticos. El árbol establece su sistema radicular en el nuevo suelo. Las hojas jóvenes son rojizas (antocianinas protectoras, normal).',
                tip: 'Riega profundamente cada 3-4 días. No fertilices el primer mes. Protege del viento con tutor y malla. La luz directa intensa puede quemar las hojas nuevas rojizas.',
                characteristics: ['Hojas nuevas rojizas', 'Crecimiento lento inicial', 'Raíces explorando en profundidad'],
            },
            {
                id: 'juvenile', daysFrom: 90, daysTo: 365,
                label: 'Desarrollo Juvenil', icon: '🌲', colorClass: 'text-green-400',
                description: 'El árbol crece formando su estructura básica. Cada "flush" (brote) puede durar 3-6 semanas. No florecerá hasta el segundo o tercer año en condiciones normales.',
                tip: 'Poda de formación suave en los primeros flush para crear copa abierta y equilibrada. Fertilización N-P-K equilibrada. Riego cada 7-10 días.',
                characteristics: ['Hojas verde brillante al madurar', 'Brotes "flush" periódicos', 'Copa en formación', 'Sin flores aún'],
            },
            {
                id: 'adult_veg', daysFrom: 365, daysTo: 730,
                label: 'Madurez Vegetativa', icon: '🌲', colorClass: 'text-green-500',
                description: 'El árbol establece su copa definitiva y puede florecer por primera vez. La floración del mango se induce con un período seco seguido de frescor nocturno (<18 °C).',
                tip: 'Reduce el riego en otoño-invierno para favorecer la inducción floral. En Canarias, el frescor de octubre-noviembre dispara la floración espontánea.',
                characteristics: ['Copa definida y simétrica', 'Primeras panículas posibles', 'Hojas maduras verde oscuro', 'Madera semi-leñosa'],
            },
            {
                id: 'productive', daysFrom: 730, daysTo: null,
                label: 'Ciclo Reproductivo', icon: '🥭', colorClass: 'text-yellow-500',
                description: 'El árbol adulto entra en ciclo anual flor-fruto. Las panículas florales aparecen en invierno-primavera. Los frutos maduran 100-150 días después de la polinización.',
                tip: 'Potasio alto para mejorar calidad y dulzor. Evita riego en exceso durante la floración. Un árbol adulto bien establecido en Canarias puede dar 50-300 mangos/año.',
                characteristics: ['Panículas florales en invierno', 'Frutos en primavera-verano', 'Aroma intenso en maduración', 'Fruto cambia de verde a amarillo/rojo'],
            },
        ],
    },

    Basil: {
        waitLabel: 'Esperando Siembra',
        waitDesc: 'Introduce la fecha de siembra de la albahaca.',
        phases: [
            {
                id: 'germ', daysFrom: 0, daysTo: 10,
                label: 'Germinación', icon: '🌱', colorClass: 'text-green-300',
                description: 'La albahaca germina en 5-10 días a 20-25 °C. La semilla necesita luz para germinar: siembra superficial sin cubrir. El sustrato no debe secarse nunca.',
                tip: 'Siembra sin tapar o con capa muy fina de vermiculita. Pulveriza en lugar de regar para no desplazar las semillas. Temperatura mínima 18 °C.',
                characteristics: ['Cotiledones pequeños y ovalados', 'Sin aroma aún', 'Muy delicada en esta fase'],
            },
            {
                id: 'seedling', daysFrom: 10, daysTo: 28,
                label: 'Plántula', icon: '🌿', colorClass: 'text-green-400',
                description: 'Aparecen las primeras hojas verdaderas con el aroma característico. Fase delicada donde el "damping off" (hongos de cuello) puede matar las plántulas.',
                tip: 'Airea a diario. Evita exceso de riego. Si ves cuello del tallo ennegrecido, reduce el riego y aplica fungicida preventivo a base de cobre.',
                characteristics: ['Primeras hojas verdaderas', 'Aroma suave perceptible', 'Tallo fino (vigilar hongos de cuello)'],
            },
            {
                id: 'growth', daysFrom: 28, daysTo: 55,
                label: 'Crecimiento Vigoroso', icon: '🌿', colorClass: 'text-green-500',
                description: 'La albahaca produce abundante follaje aromático. Cuanto más se poda, más ramifica. Pinza los ápices regularmente para evitar la subida a flor.',
                tip: 'Poda apical semanal: corta justo encima de un par de hojas para duplicar las ramas. Esto retrasa la floración que amarga el sabor. Riega cuando el sustrato esté casi seco por dentro.',
                characteristics: ['Hojas grandes y aromáticas', 'Ramificación activa', 'Color verde intenso brillante', 'Sin flores (ideal para consumo)'],
            },
            {
                id: 'bolt', daysFrom: 55, daysTo: null,
                label: 'Emisión Floral', icon: '🌸', colorClass: 'text-yellow-500',
                description: 'Con el calor y los días largos, la albahaca intenta florecer. Las hojas se vuelven más pequeñas y el sabor más amargo. La planta entra en senescencia.',
                tip: 'Elimina las espigas florales inmediatamente al aparecer para prolongar la producción. En plena floración la planta muere tras la semilla: recolecta semillas o siembra una nueva ronda.',
                characteristics: ['Espigas florales blancas o lilas', 'Hojas más pequeñas', 'Sabor amargo en hojas', 'Planta en senescencia'],
            },
        ],
    },

    Mint: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha de plantación o división del esqueje de menta.',
        phases: [
            {
                id: 'root', daysFrom: 0, daysTo: 20,
                label: 'Enraizamiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'Los esquejes de menta enraízan con facilidad en agua o sustrato húmedo en 2-3 semanas. Los estolones subterráneos comienzan a explorar el nuevo espacio.',
                tip: 'Usa sustrato húmedo pero no encharcado. Mantén en semisombra hasta que aparezcan nuevos brotes. La menta en Lanzarote necesita riego más frecuente que en zonas húmedas.',
                characteristics: ['Primeras raíces blancas', 'Hojas existentes se mantienen', 'Sin nuevo crecimiento aéreo aún'],
            },
            {
                id: 'spread', daysFrom: 20, daysTo: 60,
                label: 'Expansión Inicial', icon: '🌿', colorClass: 'text-green-400',
                description: 'Nuevos tallos y estolones emergen rápidamente. La menta puede triplicar su tamaño en pocas semanas en condiciones cálidas. Es esencial controlar su expansión.',
                tip: 'Planta siempre en maceta o con barrera enterrada 20 cm para evitar que invada el jardín. Riega con frecuencia; la menta no tolera la sequía como otras aromáticas.',
                characteristics: ['Nuevos tallos verticales', 'Estolones horizontales', 'Aroma mentolado fuerte al tocar', 'Crecimiento agresivo'],
            },
            {
                id: 'production', daysFrom: 60, daysTo: null,
                label: 'Producción / Cosecha', icon: '🫖', colorClass: 'text-green-500',
                description: 'Planta establecida con producción continua. Cosecha regularmente para mantener el sabor intenso. En Lanzarote, con suficiente agua, produce casi todo el año.',
                tip: 'Corta hasta 1/3 de la planta en cada cosecha. Renueva dividiendo la maceta cada año (los tallos viejos del centro pierden sabor). Seca hojas a la sombra para conservar el aroma.',
                characteristics: ['Follaje denso y aromático', 'Posibles flores lilas en verano', 'Raíces muy densas en maceta', 'Producción indefinida con cuidados'],
            },
        ],
    },

    Lavender: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha de plantación del esqueje o planta de lavanda.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 60,
                label: 'Establecimiento', icon: '🌿', colorClass: 'text-gray-400',
                description: 'La lavanda recién plantada establece raíces profundas. Es muy sensible al encharcamiento. El drenaje es más importante que el riego en esta fase.',
                tip: 'Tierra con >50 % de grava o arena. Riego moderado cada 7-10 días. No abones el primer mes. El suelo volcánico de Lanzarote (picón) es ideal por su drenaje excelente.',
                characteristics: ['Crecimiento mínimo visible', 'Raíces explorando', 'Hojas plateadas sin nuevos brotes'],
            },
            {
                id: 'veg', daysFrom: 60, daysTo: 150,
                label: 'Crecimiento y Formación', icon: '🌾', colorClass: 'text-purple-300',
                description: 'La planta forma su estructura arbustiva con tallos leñosos en la base. Las hojas plateadas características se multiplican. Pueden aparecer los primeros tallos florales.',
                tip: 'Pleno sol, mínimo 6-8 horas directas. Riego cada 10-15 días. Poda ligera de formación para dar forma compacta. La humedad ambiental alta favorece los hongos: ventila bien.',
                characteristics: ['Hojas lineares plateadas', 'Base leñosa formándose', 'Tallos florales tempranos', 'Aroma herbáceo intenso'],
            },
            {
                id: 'prebloom', daysFrom: 150, daysTo: 240,
                label: 'Pre-floración', icon: '🌾', colorClass: 'text-purple-400',
                description: 'Los tallos florales se alargan y los capullos se forman. Esta fase anticipa la floración principal. Los tallos con capullos pueden cosecharse ya para secar.',
                tip: 'Para ramos secos: córtalos cuando el 30-50 % de los capullos están abiertos. Sécalos boca abajo en lugar oscuro. La sequía leve intensifica el aroma de la lavanda.',
                characteristics: ['Tallos florales largos con capullos', 'Capullos morados compactos', 'Olor floral-herbáceo intenso', 'Abejas empezando a visitarla'],
            },
            {
                id: 'bloom', daysFrom: 240, daysTo: null,
                label: 'Floración Plena', icon: '🌸', colorClass: 'text-purple-500',
                description: 'Máximo esplendor aromático y visual. Los polinizadores la visitan constantemente. La poda post-floración es crucial para renovar la planta.',
                tip: 'Poda tras la floración: corta hasta 1/3 del arbusto sin llegar a la madera vieja sin hojas. Esta poda de verano rejuvenece la planta para la siguiente temporada.',
                characteristics: ['Espigas florales moradas abiertas', 'Máximo aroma', 'Polinizadores constantes', 'Color morado intenso'],
            },
        ],
    },

    Rosemary: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha de plantación del esqueje o planta de romero.',
        phases: [
            {
                id: 'adapt', daysFrom: 0, daysTo: 45,
                label: 'Adaptación', icon: '🌱', colorClass: 'text-green-300',
                description: 'El romero se adapta lentamente al nuevo sustrato. Los esquejes pueden tardar 4-6 semanas en tener raíces robustas. Las plantas de vivero se establecen más rápido.',
                tip: 'Drenaje excelente imprescindible. Riego suave cada 7-10 días. No fertilices. El romero en suelo pobre produce más aceites esenciales y sabor más intenso.',
                characteristics: ['Sin nuevo crecimiento visible', 'Hojas existentes se mantienen', 'Raíces explorando sustrato'],
            },
            {
                id: 'estb', daysFrom: 45, daysTo: 150,
                label: 'Establecimiento', icon: '🌿', colorClass: 'text-green-400',
                description: 'Aparecen nuevos brotes tiernos. La planta comienza a ramificarse. El aroma resinoso se intensifica. En clima canario crece más rápido que en zonas templadas.',
                tip: 'Poda suave de los nuevos brotes para dar forma compacta desde el inicio. Riego cada 10-14 días. El romero muere rápido por pudrición radicular: el encharcamiento es su mayor enemigo.',
                characteristics: ['Nuevos brotes tiernos', 'Aroma resinoso intenso', 'Ramificación inicial', 'Hojas aciculares características'],
            },
            {
                id: 'shrub', daysFrom: 150, daysTo: 365,
                label: 'Arbusto Joven', icon: '🌿', colorClass: 'text-green-500',
                description: 'El romero forma un arbusto compacto con base semi-leñosa. Puede producir flores azul-lila en primavera. La producción aromática es alta y constante.',
                tip: 'Poda de mantenimiento dos veces al año (primavera y otoño) para compactar. Cosecha ramitas regularmente para estimular el crecimiento. Excelente como barrera contra el viento.',
                characteristics: ['Base leñosa visible', 'Flores azul-lila en primavera', 'Alto rendimiento aromático', 'Forma compacta y densa'],
            },
            {
                id: 'mature', daysFrom: 365, daysTo: null,
                label: 'Planta Madura', icon: '🌿', colorClass: 'text-green-600',
                description: 'El romero maduro es prácticamente autosuficiente en clima mediterráneo-canario. Florece regularmente y puede vivir décadas. Cosecha todo el año.',
                tip: 'Renueva cada 5-7 años con esquejes de partes jóvenes (la madera vieja del centro se vuelve improductiva). Ideal asociado con lavanda, tomillo y otras aromáticas mediterráneas.',
                characteristics: ['Planta robusta y densa', 'Floración regular', 'Madera vieja en el centro', 'Cosecha todo el año'],
            },
        ],
    },

    Lemon: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha en que adquiriste o trasplantaste el limonero.',
        phases: [
            {
                id: 'adapt', daysFrom: 0, daysTo: 90,
                label: 'Adaptación al Nuevo Lugar', icon: '🌱', colorClass: 'text-green-300',
                description: 'El limonero trasplantado desde vivero necesita 2-3 meses para aclimatarse. Puede perder algunas hojas al inicio, lo que es normal. Las raíces exploran el nuevo sustrato.',
                tip: 'No fertilices el primer mes. Riego moderado y regular. Protege del viento con tutor. El limonero no tolera heladas; en Lanzarote el microclima costero suele ser suficiente.',
                characteristics: ['Posible caída de hojas inicial', 'Sin nuevo crecimiento activo', 'Tronco estabilizándose'],
            },
            {
                id: 'juvenile', daysFrom: 90, daysTo: 365,
                label: 'Crecimiento Juvenil', icon: '🌳', colorClass: 'text-green-400',
                description: 'El limonero produce nuevos brotes y hojas brillantes. La copa se forma progresivamente. En plantas injertadas pueden aparecer flores al año, aunque conviene eliminar las primeras.',
                tip: 'Poda de formación para 3-5 ramas principales. Fertilización N-P-K equilibrada cada 2 meses. El viento fuerte puede doblar ramas jóvenes: tutora las principales.',
                characteristics: ['Brotes tiernos brillantes', 'Hojas pecioladas características', 'Copa en desarrollo', 'Posibles primeras flores (eliminar)'],
            },
            {
                id: 'prod_start', daysFrom: 365, daysTo: 730,
                label: 'Inicio de Producción', icon: '🌸', colorClass: 'text-yellow-400',
                description: 'El limonero comienza a florecer con regularidad. Los frutos de la primera cosecha son pocos pero de buena calidad. El azahar emite un aroma extraordinario.',
                tip: 'Aporta Potasio y Magnesio para mejorar el sabor. Deja cuajar los primeros frutos. El limonero puede tener fruto, flor y brote simultáneamente, lo que es totalmente normal.',
                characteristics: ['Flores blancas (azahar)', 'Primeros limones formándose', 'Fruta verde en crecimiento', 'Aroma cítrico intenso'],
            },
            {
                id: 'productive', daysFrom: 730, daysTo: null,
                label: 'Plena Producción', icon: '🍋', colorClass: 'text-yellow-500',
                description: 'El limonero adulto produce fruta prácticamente todo el año en Canarias, con picos en invierno-primavera. Un árbol maduro puede dar 50-100 kg/año en buenas condiciones.',
                tip: 'Poda post-cosecha para airear la copa. Fertiliza 3-4 veces al año. Riega profundamente pero con menos frecuencia para favorecer raíces profundas.',
                characteristics: ['Producción continua', 'Frutos amarillos maduros', 'Flor y fruto simultáneos', 'Árbol puede vivir 50+ años'],
            },
        ],
    },

    Strawberry: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha de plantación del plantón o estolón de fresa.',
        phases: [
            {
                id: 'root', daysFrom: 0, daysTo: 25,
                label: 'Enraizamiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'El plantón recién instalado establece su sistema radicular superficial. La corona no debe quedar ni enterrada ni elevada; al nivel del suelo.',
                tip: 'Riego frecuente y suave: la corona no debe secarse pero tampoco encharcarse. Aplica mulch alrededor para retener humedad y mantener frescas las raíces superficiales.',
                characteristics: ['Corona bien nivelada', 'Hojas firmes existentes', 'Sin tallos florales aún', 'Raíces explorando'],
            },
            {
                id: 'veg', daysFrom: 25, daysTo: 60,
                label: 'Desarrollo Foliar', icon: '🌿', colorClass: 'text-green-400',
                description: 'La planta desarrolla nuevas hojas trifoliadas. Los estolones (stolones) se extienden para colonizar el sustrato. Elimínalos si quieres maximizar la producción de fruta.',
                tip: 'Corta los estolones que salen de la planta madre para concentrar la energía en la fructificación. Comienza fertilización P-K moderada cuando aparezcan los primeros botones.',
                characteristics: ['Hojas trifoliadas nuevas', 'Estolones emergiendo', 'Corona bien definida', 'Crecimiento activo'],
            },
            {
                id: 'flower', daysFrom: 60, daysTo: 90,
                label: 'Floración', icon: '🌸', colorClass: 'text-pink-400',
                description: 'Flores blancas con 5 pétalos aparecen en los tallos florales. La polinización por abejas es fundamental. Las flores abiertas son sensibles a la lluvia fuerte.',
                tip: 'Evita mojar las flores al regar (usa riego localizado). No apliques plaguicidas durante la floración para proteger a los polinizadores. Temperatura ideal de cuaje: 15-25 °C.',
                characteristics: ['Flores blancas de 5 pétalos', 'Polinizadores activos', 'Primeras fresas verdes al final', 'Pétalos caídos dejando el fruto'],
            },
            {
                id: 'harvest', daysFrom: 90, daysTo: null,
                label: 'Cosecha', icon: '🍓', colorClass: 'text-red-500',
                description: 'Las fresas maduran progresivamente. En Canarias la temporada se extiende mucho gracias al clima suave. Cada planta puede producir durante varios meses antes de agotarse.',
                tip: 'Cosecha cuando la fresa esté completamente roja incluyendo la base. Recógelas cada 2-3 días. Tras la temporada, poda el follaje a 5 cm del suelo y renueva el mulch.',
                characteristics: ['Fresas rojas madurando', 'Aroma dulce intenso', 'Fruta firme al tacto', 'Producción escalonada'],
            },
        ],
    },

    Potato: {
        waitLabel: 'Esperando Siembra',
        waitDesc: 'Introduce la fecha en que sembraste las papas / patatas.',
        phases: [
            {
                id: 'sprout', daysFrom: 0, daysTo: 25,
                label: 'Brotación', icon: '🌱', colorClass: 'text-green-300',
                description: 'Los ojos de la patata semilla brotan bajo tierra. Los primeros tallos verdes emergen a la superficie en 2-4 semanas según la temperatura del suelo.',
                tip: 'Pre-germinación: deja las patatas semilla a la luz 2-3 semanas antes de plantar para que "chiten" (brotes cortos). Siembra a 10-15 cm de profundidad.',
                characteristics: ['Tallos emergiendo', 'Primeras hojas pinnadas', 'Sin tubérculos formados aún'],
            },
            {
                id: 'veg', daysFrom: 25, daysTo: 65,
                label: 'Crecimiento Foliar', icon: '🌿', colorClass: 'text-green-500',
                description: 'El follaje se desarrolla activamente y la planta acumula energía. Los estolones subterráneos forman los futuros tubérculos. La aporca es esencial en esta fase.',
                tip: 'Aporca cuando el tallo tenga 20-25 cm: cubre la base con tierra para evitar que los tubérculos queden verdes al sol (solanina tóxica). Riego regular sin encharcamiento.',
                characteristics: ['Follaje verde denso', 'Tallos fuertes y erectos', 'Estolones subterráneos formándose', 'Floración al final de fase'],
            },
            {
                id: 'tuber', daysFrom: 65, daysTo: 100,
                label: 'Llenado del Tubérculo', icon: '🥔', colorClass: 'text-amber-500',
                description: 'Los tubérculos crecen y acumulan almidón. El follaje puede comenzar a amarillear (energía yendo a los tubérculos). Es la fase de mayor demanda hídrica.',
                tip: 'Riego crítico en esta fase: la sequía produce tubérculos irregulares. Puedes "hurgar" suavemente en la base para ver el tamaño sin extraer toda la planta.',
                characteristics: ['Follaje amarilleando progresivamente', 'Flores caídas', 'Tubérculos en crecimiento', 'Piel aún delicada'],
            },
            {
                id: 'harvest', daysFrom: 100, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🧺', colorClass: 'text-orange-500',
                description: 'El follaje se seca (senescencia) indicando que la energía se ha transferido completamente a los tubérculos. La piel se engrosa para el almacenamiento.',
                tip: 'Espera 2 semanas desde que el follaje muere antes de cosechar: la piel se engrosa y aguantan mejor almacenadas. Cosecha con suelo seco. Cura a la sombra 1 semana antes de consumir.',
                characteristics: ['Follaje seco y caído', 'Piel gruesa y resistente', 'Tubérculos bien formados', 'Aroma a tierra húmeda al cavar'],
            },
        ],
    },

    Lettuce: {
        waitLabel: 'Esperando Siembra',
        waitDesc: 'Introduce la fecha de siembra o trasplante de la lechuga.',
        phases: [
            {
                id: 'germ', daysFrom: 0, daysTo: 10,
                label: 'Germinación', icon: '🌱', colorClass: 'text-green-300',
                description: 'La lechuga germina en 3-7 días a 15-20 °C. Por encima de 25 °C la germinación falla (termoinhibición). En Canarias es mejor sembrar en otoño, invierno o primavera.',
                tip: 'En verano canario, siembra en ambiente fresco o a la sombra. La lechuga es el cultivo de temporada fría por excelencia en Lanzarote.',
                characteristics: ['Cotiledones alargados', 'Germinación en 3-7 días', 'Muy sensible al calor excesivo'],
            },
            {
                id: 'seedling', daysFrom: 10, daysTo: 28,
                label: 'Plántula', icon: '🥬', colorClass: 'text-green-400',
                description: 'Las primeras hojas verdaderas aparecen y la planta puede trasplantarse al lugar definitivo. El trasplante temprano favorece el desarrollo antes del calor.',
                tip: 'Trasplanta cuando tenga 4-6 hojas verdaderas. Riega bien antes y después. En Canarias, trasplanta a última hora del día para evitar estrés por calor.',
                characteristics: ['Hojas verdaderas pequeñas', 'Raíz pivotante visible', 'Crecimiento rápido'],
            },
            {
                id: 'rosette', daysFrom: 28, daysTo: 55,
                label: 'Formación de la Roseta', icon: '🥬', colorClass: 'text-green-500',
                description: 'La lechuga forma su roseta característica. En variedades de cabeza, las hojas interiores se aprietan y blanquean. En variedades de hoja se puede cosechar de forma continua.',
                tip: 'Riego frecuente y uniforme: la sequía produce hojas amargas. Fertilización nitrogenada suave. Cubre con malla antiinsectos para evitar la mosca blanca y el pulgón.',
                characteristics: ['Roseta bien definida', 'Hojas internas blanqueando (cabezas)', 'Aumento rápido de volumen', 'Hojas crujientes y frescas'],
            },
            {
                id: 'harvest', daysFrom: 55, daysTo: null,
                label: 'Punto de Corte', icon: '✂️', colorClass: 'text-emerald-500',
                description: 'La lechuga alcanza su tamaño óptimo. Si se retrasa la cosecha con calor, "sube a flor" y las hojas se vuelven amargas. En Canarias el ciclo se acelera con el calor.',
                tip: 'Cosecha al amanecer cuando las hojas están turgentes. Corta por la base con cuchillo limpio. Si el tallo central se alarga, cosecha inmediatamente: está subiendo a flor.',
                characteristics: ['Cabeza firme (variedades de cabeza)', 'Hojas densas y crujientes', 'Tallo central alargándose = cosechar ya', 'Riesgo de subida a flor con calor'],
            },
        ],
    },

    Cucumber: {
        waitLabel: 'Esperando Siembra / Trasplante',
        waitDesc: 'Introduce la fecha de siembra o trasplante del pepino.',
        phases: [
            {
                id: 'seedling', daysFrom: 0, daysTo: 14,
                label: 'Germinación y Plántula', icon: '🌱', colorClass: 'text-green-300',
                description: 'El pepino germina en 4-7 días a 22-28 °C. Es una de las hortalizas más sensibles al frío: temperatura mínima 15 °C para un desarrollo correcto.',
                tip: 'Siembra en semillero y trasplanta cuando tenga 4 hojas verdaderas (unos 14 días). No trasplantes con raíces desnudas: usa cepellón para no dañar la raíz pivotante.',
                characteristics: ['Cotiledones anchos', 'Hojas un poco ásperas al tacto', 'Tallo suculento y delicado'],
            },
            {
                id: 'veg', daysFrom: 14, daysTo: 40,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'El pepino crece muy rápido en calor. Los zarcillos le permiten trepar por una espaldera. Es una planta trepadora que necesita soporte para producir bien.',
                tip: 'Coloca espaldera o red vertical: los pepinos de suelo se deforman y son propensos a hongos. Nitrógeno y Potasio equilibrados. Riego abundante y uniforme.',
                characteristics: ['Hojas grandes con pubescencia', 'Zarcillos para trepar', 'Crecimiento muy rápido en verano', 'Sin flores aún'],
            },
            {
                id: 'flower', daysFrom: 40, daysTo: 60,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'El pepino produce flores masculinas primero, y luego flores femeninas (con ovario en la base). Las abejas y otros polinizadores son fundamentales para el cuaje.',
                tip: 'Identifica las flores femeninas (tienen un pepino en miniatura en la base). Las variedades partenocárpicas no necesitan polinización. Mantén la planta bien regada durante la floración.',
                characteristics: ['Flores amarillas masculinas (primeras)', 'Flores femeninas con ovario visible', 'Polinizadores activos', 'Primeros pepinos formándose'],
            },
            {
                id: 'harvest', daysFrom: 60, daysTo: null,
                label: 'Cosecha', icon: '🥒', colorClass: 'text-green-600',
                description: 'Los pepinos están listos 50-60 días tras la siembra. Cosecha cuando tengan el tamaño deseado antes de que amarilleen. Una cosecha regular estimula la producción continua.',
                tip: 'Cosecha cada 2-3 días para estimular la producción. Los pepinos sobremaduros (amarillos) consumen la energía de la planta. Corta con tijera, no arranques.',
                characteristics: ['Frutos verde intenso y firmes', 'Piel lisa o con espinas suaves', 'Aumento rápido de tamaño', 'Producción continua hasta el frío'],
            },
        ],
    },

    Zucchini: {
        waitLabel: 'Esperando Siembra / Trasplante',
        waitDesc: 'Introduce la fecha de siembra o trasplante del calabacín.',
        phases: [
            {
                id: 'seedling', daysFrom: 0, daysTo: 12,
                label: 'Germinación', icon: '🌱', colorClass: 'text-green-300',
                description: 'El calabacín germina en 3-5 días a 20-25 °C. Es una planta de desarrollo muy rápido. Semillas grandes que germinan con facilidad.',
                tip: 'Siembra en jiffy o maceta pequeña a 2 cm de profundidad. La semilla es grande y fácil de manejar. Trasplanta con cuidado al lugar definitivo cuando tenga 3-4 hojas.',
                characteristics: ['Cotiledones grandes y carnosos', 'Germinación rápida (3-5 días)', 'Hipocótilo grueso'],
            },
            {
                id: 'veg', daysFrom: 12, daysTo: 35,
                label: 'Desarrollo Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'El calabacín crece muy rápido produciendo hojas grandes con manchas blanquecinas plateadas (normal, no es enfermedad). Necesita espacio: ocupa 1-2 m² por planta.',
                tip: 'Deja al menos 1 m de distancia entre plantas. Nitrógeno alto para el follaje. Riego regular y abundante: el calabacín consume mucha agua con su follaje enorme.',
                characteristics: ['Hojas grandes con manchas plateadas', 'Tallos huecos y frágiles', 'Crecimiento de 5-10 cm/día con calor', 'Espinas en los tallos'],
            },
            {
                id: 'flower', daysFrom: 35, daysTo: 50,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Las grandes flores naranjas-amarillas abren por la mañana durante pocas horas. Las flores masculinas aparecen antes que las femeninas (con ovario en la base).',
                tip: 'Si no hay polinizadores naturales, poliniza manualmente: lleva el polen de una flor masculina a la femenina con un pincel a primera hora. La oídio es común: vigila el polvo blanco en hojas.',
                characteristics: ['Flores naranjas grandes', 'Flores femeninas con minifruto en base', 'Apertura solo por la mañana', 'Atraen abejas y abejorros'],
            },
            {
                id: 'harvest', daysFrom: 50, daysTo: null,
                label: 'Cosecha Continua', icon: '🥬', colorClass: 'text-green-600',
                description: 'El calabacín crece muy rápido: puede duplicar su tamaño en 24-48 horas. Cosecha cuando mida 15-20 cm para mejor sabor y textura. Si se deja crecer produce calabaza enorme.',
                tip: 'Revisa la planta cada día: los calabacines que se escapan se vuelven enormes y consumen toda la energía de la planta. Corta con cuchillo, no arranques. La cosecha frecuente estimula más flores.',
                characteristics: ['Frutos de 15-20 cm listos para cosechar', 'Crecimiento muy rápido', 'Producción masiva en verano', 'Flores también son comestibles'],
            },
        ],
    },

    Watermelon: {
        waitLabel: 'Esperando Siembra / Trasplante',
        waitDesc: 'Introduce la fecha de siembra o trasplante de la sandía.',
        phases: [
            {
                id: 'seedling', daysFrom: 0, daysTo: 14,
                label: 'Germinación y Plántula', icon: '🌱', colorClass: 'text-green-300',
                description: 'La sandía germina en 5-10 días a 25-30 °C. Necesita mucho calor para un buen arranque. Por debajo de 20 °C la germinación es lenta y errática.',
                tip: 'Siembra en semillero caliente (encima de una estufa o con esterilla calefactora). En Canarias el calor de primavera-verano es ideal. Trasplanta con cepellón sin romper raíces.',
                characteristics: ['Cotiledones grandes y ovalados', 'Hipocótilo largo', 'Muy sensible al frío'],
            },
            {
                id: 'veg', daysFrom: 14, daysTo: 45,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'Las guías rastreras se extienden rápidamente. La sandía necesita mucho espacio: 2-4 m² por planta. Las hojas lobuladas características se desarrollan abundantemente.',
                tip: 'Deja solo 2-3 guías principales, elimina el resto para concentrar energía. Nitrógeno moderado. Mulch negro sobre el suelo calienta las raíces y retiene humedad. Necesita mucho sol directo.',
                characteristics: ['Guías rastreras largas', 'Hojas lobuladas verde grisáceo', 'Zarcillos para anclarse', 'Expansión rápida'],
            },
            {
                id: 'flower', daysFrom: 45, daysTo: 65,
                label: 'Floración y Cuaje', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Flores amarillas masculinas y femeninas aparecen en la misma planta. Las femeninas tienen el ovario (minisandía) en la base. Necesitan polinización cruzada.',
                tip: 'Poliniza a mano a primera hora con una flor masculina recién abierta si no hay abejas. Marca la fecha de cuaje de cada sandía con una etiqueta para saber cuándo cosechar.',
                characteristics: ['Flores amarillas masculinas y femeninas', 'Minisandías en base de flores femeninas', 'Cuaje visible en 3-5 días', 'Polinización matutina'],
            },
            {
                id: 'fruit_dev', daysFrom: 65, daysTo: 110,
                label: 'Desarrollo del Fruto', icon: '🍉', colorClass: 'text-green-600',
                description: 'Las sandías crecen rápidamente. El fruto tarda 30-50 días en madurar desde el cuaje. La raya característica y el color se intensifican a medida que madura.',
                tip: 'Pon un trozo de madera o teja bajo cada sandía para evitar pudredumbre por contacto con el suelo. Riego uniforme y abundante: la sequía produce fruta con poca carne.',
                characteristics: ['Frutos en crecimiento rápido', 'Rayas visibles', 'Superficie brillante', 'Zarcillo cerca del fruto secándose = señal de madurez'],
            },
            {
                id: 'harvest', daysFrom: 110, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🍉', colorClass: 'text-red-500',
                description: 'La sandía está lista cuando: el zarcillo más cercano al fruto está completamente seco, el golpe suena hueco, y la zona de contacto con el suelo es amarilla-crema.',
                tip: 'No cortes antes de tiempo: la sandía no madura fuera de la planta. La prueba del sonido es la más fiable: golpe sordo = madura, golpe agudo = verde. El calor canario acelera la maduración.',
                characteristics: ['Zarcillo adyacente seco y marrón', 'Golpe sordo al dar palmada', 'Zona de suelo amarilla-crema', 'Superficie mate (no brillante)'],
            },
        ],
    },

    Onion: {
        waitLabel: 'Esperando Siembra / Trasplante',
        waitDesc: 'Introduce la fecha de siembra o trasplante de la cebolla.',
        phases: [
            {
                id: 'seedling', daysFrom: 0, daysTo: 20,
                label: 'Germinación / Plantación', icon: '🌱', colorClass: 'text-green-300',
                description: 'La cebolla germina en 7-14 días desde semilla, o se puede plantar directamente desde sets (cebollines pequeños). Prefiere temperaturas de 15-25 °C para germinar.',
                tip: 'Siembra en semillero denso y trasplanta a los 45-60 días, o usa sets (cebollines) para ahorrarte tiempo. Planta a 10-15 cm de separación en Canarias.',
                characteristics: ['Hojas tubulares finas y erguidas', 'Verde intenso', 'Raíces superficiales blancas'],
            },
            {
                id: 'veg', daysFrom: 20, daysTo: 80,
                label: 'Desarrollo Foliar', icon: '🌿', colorClass: 'text-green-400',
                description: 'El follaje verde se desarrolla activamente. La planta acumula energía en las hojas tubulares que luego se transferirá al bulbo. Importante el nitrógeno en esta fase.',
                tip: 'Nitrógeno alto en las primeras semanas. Riego regular pero sin encharcamiento. Elimina las flores si aparecen (la cebolla que florece no forma buen bulbo). Desherba con frecuencia.',
                characteristics: ['Hojas tubulares azul-verdosas', 'Sin bulbo visible aún', 'Raíces superficiales', 'Crecimiento continuo'],
            },
            {
                id: 'bulb', daysFrom: 80, daysTo: 120,
                label: 'Engorde del Bulbo', icon: '🧅', colorClass: 'text-yellow-400',
                description: 'El follaje comienza a doblegarse y la energía se transfiere al bulbo. El engorde se activa cuando los días superan cierta longitud (fotoperiodo). En Canarias esto ocurre en primavera.',
                tip: 'Reduce el nitrógeno y aumenta el Potasio para favorecer el engorde. Deja de regar cuando el follaje empiece a caer. No cubras el bulbo con tierra: debe asomarse.',
                characteristics: ['Follaje empezando a doblarse', 'Bulbo visible y en crecimiento', 'Piel externa formándose', 'Reducción del riego'],
            },
            {
                id: 'harvest', daysFrom: 120, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🧅', colorClass: 'text-orange-400',
                description: 'La cebolla está lista cuando el 50-75 % del follaje está caído. El cuello se seca e impide la entrada de humedad al bulbo. Momento óptimo para cosechar y curar.',
                tip: 'Arranca con suelo seco. Cura al sol 2 semanas (o en lugar cálido y aireado): el curado forma la piel protectora. Una vez curadas, las cebollas aguantan meses a temperatura ambiente.',
                characteristics: ['Follaje caído y seco', 'Cuello seco y estrecho', 'Piel externa crujiente y brillante', 'Bulbo compacto y firme'],
            },
        ],
    },

    Garlic: {
        waitLabel: 'Esperando Siembra',
        waitDesc: 'Introduce la fecha en que plantaste los dientes de ajo.',
        phases: [
            {
                id: 'sprout', daysFrom: 0, daysTo: 21,
                label: 'Brotación', icon: '🌱', colorClass: 'text-green-300',
                description: 'Los dientes de ajo brotan en 7-21 días dependiendo de la temperatura del suelo. En Canarias se planta en otoño-invierno para aprovechar el frescor.',
                tip: 'Planta los dientes a 5 cm de profundidad con la punta hacia arriba. Separa 10-15 cm entre dientes. El ajo en Canarias se planta en octubre-diciembre para cosechar en mayo-julio.',
                characteristics: ['Primeros brotes verdes emergiendo', 'Hoja tubular inicial', 'Raíces blancas superficiales'],
            },
            {
                id: 'veg', daysFrom: 21, daysTo: 90,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-400',
                description: 'El ajo produce 6-10 hojas planas y largas. La energía acumulada en las hojas se transferirá al bulbo. Es la fase de mayor demanda de Nitrógeno.',
                tip: 'Riega regularmente pero sin encharcar. Nitrógeno moderado. Elimina las hojas bajeras amarillentas. Mantén el suelo libre de malas hierbas (el ajo pierde producción con competencia).',
                characteristics: ['Hojas planas y largas', 'Verde intenso', '6-10 hojas por planta', 'Sin bulbo diferenciado aún'],
            },
            {
                id: 'scape', daysFrom: 90, daysTo: 120,
                label: 'Escapo Floral (Bulbillo)', icon: '🌾', colorClass: 'text-yellow-400',
                description: 'El ajo de cuello duro produce un escapo floral enrollado. En el ajo de cuello blando no aparece. Eliminar el escapo en el ajo de cuello duro mejora hasta un 30 % la producción del bulbo.',
                tip: 'Corta el escapo floral (la "col·la") cuando tenga un par de vueltas: son comestibles y deliciosos salteados. Cambia a fertilizante P-K para favorecer el engorde del bulbo.',
                characteristics: ['Escapo floral enrollado (cuello duro)', 'Umbela con flores/bulbillos', 'Follaje maduro verde oscuro', 'Reducción del riego gradual'],
            },
            {
                id: 'harvest', daysFrom: 120, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🧄', colorClass: 'text-amber-500',
                description: 'El ajo está listo cuando la mitad inferior del follaje está seca y amarilla, pero la mitad superior aún verde. Sacar demasiado pronto da bulbos sin piel; demasiado tarde, los dientes se separan.',
                tip: 'Arranca con suelo seco. Cura en lugar aireado y seco 3-4 semanas antes de almacenar. Las trenzas de ajo curado aguantan 6-12 meses. Guarda los mejores dientes para la próxima siembra.',
                characteristics: ['Follaje inferior seco y amarillo', 'Follaje superior aún verde', 'Bulbo compacto sin dientes separados', 'Piel seca y papirácea'],
            },
        ],
    },

    Parsley: {
        waitLabel: 'Esperando Siembra',
        waitDesc: 'Introduce la fecha de siembra del perejil.',
        phases: [
            {
                id: 'germ', daysFrom: 0, daysTo: 21,
                label: 'Germinación', icon: '🌱', colorClass: 'text-green-300',
                description: 'El perejil germina muy lentamente: 14-21 días. Es normal que tarde; mantén el sustrato húmedo y la temperatura entre 18-22 °C. La impaciencia es el error más común.',
                tip: 'Remoja las semillas en agua tibia 12 horas antes de sembrar para acelerar la germinación. Siembra en líneas a 5 mm de profundidad. No dejes secar el semillero nunca.',
                characteristics: ['Germinación muy lenta (14-21 días)', 'Primeras plúmulas delicadas', 'Sensible a encharcamiento'],
            },
            {
                id: 'seedling', daysFrom: 21, daysTo: 45,
                label: 'Plántula', icon: '🌿', colorClass: 'text-green-400',
                description: 'Las primeras hojas de perejil son simples y alargadas, muy distintas a las hojas adultas rizado o liso. El crecimiento es lento pero constante.',
                tip: 'Aclara las plántulas dejando 5-7 cm entre plantas si sembraste en línea. Las plántulas aclaradas se pueden trasplantar. Riego suave con regadera de alcachofa fina.',
                characteristics: ['Hojas primarias simples', 'Tallo fino y frágil', 'Crecimiento muy lento al inicio'],
            },
            {
                id: 'rosette', daysFrom: 45, daysTo: 90,
                label: 'Desarrollo de Roseta', icon: '🌿', colorClass: 'text-green-500',
                description: 'El perejil forma su roseta característica con las hojas dentadas (liso) o rizadas (rizado). Ya se puede cosechar regularmente cortando las hojas externas.',
                tip: 'Cosecha siempre las hojas más externas y viejas. Nunca cortes el corazón (las hojas centrales pequeñas). Fertiliza con N bajo-medio cada 3-4 semanas.',
                characteristics: ['Roseta bien definida', 'Hojas dentadas o rizadas', 'Primer corte posible', 'Aroma intenso ya presente'],
            },
            {
                id: 'productive', daysFrom: 90, daysTo: 240,
                label: 'Producción Continua', icon: '🌿', colorClass: 'text-emerald-500',
                description: 'El perejil en plena producción puede cosecharse semanalmente. En el clima canario templado puede mantenerse productivo durante 12-18 meses antes de subir a flor.',
                tip: 'Corta regularmente para evitar que suba a flor. Si aparece el tallo floral central, córtalo inmediatamente. El perejil perenne en Canarias puede producir todo el año.',
                characteristics: ['Producción abundante de hojas', 'Hojas ricas en vitaminas A y C', 'Renovación constante desde el centro', 'Resistente a cortes frecuentes'],
            },
            {
                id: 'bolt', daysFrom: 240, daysTo: null,
                label: 'Subida a Flor', icon: '🌸', colorClass: 'text-yellow-500',
                description: 'El perejil produce su tallo floral y entra en la fase reproductiva. Las hojas se vuelven más pequeñas y el sabor más amargo. Es el momento de recolectar semillas o arrancar y resembrar.',
                tip: 'Deja florecer y recolecta las semillas para resembrar. El ciclo completo dura 2 años (bianual). En Canarias el calor de verano puede acelerar la subida a flor.',
                characteristics: ['Tallo floral largo y hueco', 'Flores blancas en umbela', 'Hojas pequeñas y amargas', 'Semillas formándose'],
            },
        ],
    },

    PepperCommon: {
        waitLabel: 'Esperando Trasplante',
        waitDesc: 'Introduce la fecha de trasplante del pimiento común al lugar definitivo.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 21,
                label: 'Establecimiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'El pimiento común trasplantado adapta sus raíces. Los frutos maduran de verde a rojo intenso y tienen sabor dulce o ligeramente amargo según variedad.',
                tip: 'No fertilices los primeros 10 días. Riega con agua templada. Protege del sol directo las dos primeras semanas con malla de sombreo del 30 %.',
                characteristics: ['Adaptación al nuevo sustrato', 'Posible languidez transitoria', 'Sin crecimiento nuevo aún'],
            },
            {
                id: 'veg', daysFrom: 21, daysTo: 65,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'Desarrollo vigoroso con formación de la estructura en "Y". El pimiento común es robusto y tolera bien el sol canario una vez establecido.',
                tip: 'Deja 2-3 ramas principales. N:P:K 3-1-2. El viento Alisio puede tumbar plantas altas; tutora con caña de bambú. El suelo volcánico requiere más riego que el continental.',
                characteristics: ['Hojas anchas y brillantes', 'Estructura en "Y" desarrollándose', 'Internodos bien definidos'],
            },
            {
                id: 'flower', daysFrom: 65, daysTo: 100,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Flores blancas solitarias en cada horquilla. Las primeras 2-3 flores pueden eliminarse para fortalecer más la estructura antes de la fructificación.',
                tip: 'Cambia a N:P:K 1-3-2. Evita temperaturas nocturnas <15 °C. Polinización asistida con pincel en ambiente sin viento o con pocos polinizadores.',
                characteristics: ['Flores blancas en horquillas', 'Botones florales en abundancia', 'Primeros frutos cuajando'],
            },
            {
                id: 'fruit_dev', daysFrom: 100, daysTo: 150,
                label: 'Engorde del Fruto', icon: '🫑', colorClass: 'text-green-600',
                description: 'Los pimientos comunes crecen y se vuelven carnosos. Son más grandes que el pimiento padrón y tienen carne más gruesa. Ideales para asar o rellenar.',
                tip: 'Riego uniforme para frutos firmes. Aporta calcio foliar para prevenir BER. Poda hojas interiores para mejorar aireación y reducir humedad en el centro de la planta.',
                characteristics: ['Frutos verdes y carnosos creciendo', 'Piel gruesa y brillante', 'Peso visible aumentando'],
            },
            {
                id: 'harvest', daysFrom: 150, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🔴', colorClass: 'text-red-500',
                description: 'Los pimientos comunes viran a rojo, amarillo o naranja según variedad. El sabor se intensifica y el contenido en vitamina C se duplica respecto al verde.',
                tip: 'Cosecha en verde para uso inmediato, o espera al color final para máximo dulzor. Corta con tijera limpia sin tirar. La planta sigue produciendo nuevas flores tras cada cosecha.',
                characteristics: ['Viraje de color completándose', 'Piel firme y brillante', 'Aroma dulce concentrado', 'Semillas maduras en interior'],
            },
        ],
    },

    PepperItalian: {
        waitLabel: 'Esperando Trasplante',
        waitDesc: 'Introduce la fecha de trasplante del pimiento italiano al lugar definitivo.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 21,
                label: 'Establecimiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'El pimiento italiano (tipo Cuerno de Toro o Lamuyo) trasplantado adapta sus raíces. Son pimientos largos, carnosos y muy dulces, ideales para asar.',
                tip: 'Protege del sol intenso los primeros 14 días. Sin fertilización hasta que broten nuevas hojas. El pimiento italiano agradece sustratos ricos en materia orgánica.',
                characteristics: ['Posible languidez transitoria', 'Raíces adaptándose', 'Sin crecimiento nuevo aún'],
            },
            {
                id: 'veg', daysFrom: 21, daysTo: 65,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'El pimiento italiano crece erecto y vigoroso. Los tallos son más delgados que el pimiento común pero la planta puede alcanzar 100-130 cm de altura.',
                tip: 'Tutora bien: los pimientos italianos con frutos grandes se doblan con el peso. Usa estacas de 120 cm. Nitrógeno moderado para no sobrecrear vegetación a expensas de la fruta.',
                characteristics: ['Tallo erecto y vigoroso', 'Hojas alargadas y brillantes', 'Rápido crecimiento en calor'],
            },
            {
                id: 'flower', daysFrom: 65, daysTo: 100,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Flores blancas solitarias con pétalos reflexos. El pimiento italiano cuaja bien con temperatura de 18-28 °C. Más de 35 °C durante el día puede causar caída de flores.',
                tip: 'En días de calima o calor extremo, proporciona sombra temporal y aumenta el riego. La polinización es más eficiente con brisa suave que con el Alisio fuerte.',
                characteristics: ['Flores blancas con pétalos reflexos', 'Primer cuaje visible', 'Temperatura óptima 20-28 °C'],
            },
            {
                id: 'fruit_dev', daysFrom: 100, daysTo: 155,
                label: 'Desarrollo del Fruto Largo', icon: '🌿', colorClass: 'text-green-600',
                description: 'Los característicos pimientos italianos alargados se desarrollan. Pueden alcanzar 20-30 cm de longitud. El color verde va aclarando conforme maduran.',
                tip: 'No dejes demasiados frutos por planta (máximo 8-10 a la vez). Quita los frutos dañados inmediatamente. El viento fuerte puede romper las ramas cargadas.',
                characteristics: ['Frutos alargados de 20-30 cm', 'Piel delgada y suave', 'Color verde brillante', 'Forma característica curvada'],
            },
            {
                id: 'harvest', daysFrom: 155, daysTo: null,
                label: 'Maduración y Cosecha', icon: '🔴', colorClass: 'text-red-400',
                description: 'El pimiento italiano vira a rojo intenso, aumentando su dulzor. Es la variedad más valorada para asar al horno o a la brasa. El sabor ahumado es incomparable.',
                tip: 'La cosecha en rojo es ideal para asar y conservar. Congela los pimientos asados pelados: duran 6 meses. En Canarias se pueden secar al sol directamente para hacer pimentón.',
                characteristics: ['Color rojo intenso o amarillo', 'Carne muy gruesa y dulce', 'Aroma concentrado al cortar', 'Piel se desprende fácilmente al asar'],
            },
        ],
    },

    PepperPadron: {
        waitLabel: 'Esperando Trasplante',
        waitDesc: 'Introduce la fecha de trasplante del pimiento de Padrón al lugar definitivo.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 18,
                label: 'Establecimiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'El pimiento de Padrón (Capsicum annuum "de Padrón") trasplantado en Canarias. Famoso por su característica de que "unos pican y otros no": la capsaicina varía según el estrés hídrico.',
                tip: 'Trasplanta con cepellón. Riega bien el primer día y luego espera 3-4 días antes del segundo riego. El suelo volcánico drena rápido: controla la humedad a 5 cm de profundidad.',
                characteristics: ['Plántula delicada en adaptación', 'Hojas pequeñas características', 'Raíces poco desarrolladas aún'],
            },
            {
                id: 'veg', daysFrom: 18, daysTo: 55,
                label: 'Crecimiento Vegetativo', icon: '🌿', colorClass: 'text-green-500',
                description: 'El pimiento de Padrón crece más compacto que otras variedades. Produce muchas ramas laterales que darán abundantes frutos pequeños. Excelente para maceta.',
                tip: 'En maceta de 20-30L da excelentes resultados. Nitrógeno moderado para no crear plantas demasiado grandes. El pimiento de Padrón prefiere temperaturas de 20-30 °C.',
                characteristics: ['Planta compacta y ramificada', 'Hojas pequeñas y ovales', 'Muchas ramas laterales'],
            },
            {
                id: 'flower', daysFrom: 55, daysTo: 85,
                label: 'Floración', icon: '🌼', colorClass: 'text-yellow-400',
                description: 'Flores blancas pequeñas en abundancia. El pimiento de Padrón produce flores de forma continua durante toda la temporada, especialmente con calor moderado.',
                tip: 'No elimines las primeras flores: el pimiento de Padrón cuaja bien desde el principio. Mantén temperatura nocturna >13 °C para evitar aborto de flores.',
                characteristics: ['Flores blancas pequeñas y abundantes', 'Producción continua', 'Cuaje rápido con calor'],
            },
            {
                id: 'fruit_dev', daysFrom: 85, daysTo: 110,
                label: 'Frutos en Verde', icon: '🫑', colorClass: 'text-green-600',
                description: 'Los pimientos de Padrón se cosechan en verde cuando miden 4-6 cm. La mayoría son suaves, pero un 10-20% serán picantes, especialmente los más maduros o los que han sufrido estrés.',
                tip: 'Cosecha cuando el fruto tenga 4-6 cm: en este tamaño el 90% son suaves. Si esperas a 7-8 cm, el porcentaje picante aumenta. La sequía aumenta la capsaicina: ¡controla el riego!',
                characteristics: ['Frutos pequeños de 4-7 cm', 'Color verde brillante', 'Piel lisa y brillante', 'Algunos muy picantes (sorpresa)'],
            },
            {
                id: 'harvest', daysFrom: 110, daysTo: null,
                label: 'Producción Continua', icon: '🍽️', colorClass: 'text-emerald-500',
                description: 'En plena producción, el pimiento de Padrón puede dar hasta 2 kg por planta en una temporada. La cosecha frecuente (cada semana) estimula nuevas flores y frutos sin parar.',
                tip: 'Frítelos en aceite de oliva con sal gorda: la receta gallega clásica. En Canarias se cultivan perfectamente de marzo a noviembre. El estrés hídrico moderado = más picante = más sabroso.',
                characteristics: ['Producción semanal de frutos', 'Planta muy productiva', 'Continúa hasta las primeras heladas', 'Frutos en distintos estados de madurez'],
            },
        ],
    },

    SweetPotato: {
        waitLabel: 'Esperando Plantación',
        waitDesc: 'Introduce la fecha en que plantaste los esquejes (estaquillas) de batata.',
        phases: [
            {
                id: 'estb', daysFrom: 0, daysTo: 25,
                label: 'Establecimiento', icon: '🌱', colorClass: 'text-green-300',
                description: 'Los esquejes de batata (estaquillas de 25-30 cm) enraízan en 2-3 semanas en clima cálido. La batata se propaga vegetativamente, no por semilla. Necesita calor para arrancar.',
                tip: 'Planta los esquejes con 2-3 nudos enterrados en suelo cálido y húmedo. En Canarias se planta en primavera cuando el suelo supera 18 °C. No riegues en exceso la primera semana.',
                characteristics: ['Posible languidez inicial', 'Nuevas hojas verdes emergiendo', 'Raíces nodales desarrollándose'],
            },
            {
                id: 'veg', daysFrom: 25, daysTo: 75,
                label: 'Crecimiento de Guías', icon: '🌿', colorClass: 'text-green-500',
                description: 'La batata produce guías rastreras largas que cubren el suelo. Las hojas en forma de corazón o lobuladas se multiplican. El follaje es vigoroso y cubre el suelo eliminando malas hierbas.',
                tip: 'No hieras las guías al crecer: si tienen raíces en los nudos, quítalas para que la energía vaya a los tubérculos principales. Riego moderado; la batata tolera algo de sequía.',
                characteristics: ['Guías rastreras largas', 'Hojas en forma de corazón', 'Cobertura total del suelo', 'Crecimiento agresivo'],
            },
            {
                id: 'tuber', daysFrom: 75, daysTo: 130,
                label: 'Formación de Tubérculos', icon: '🍠', colorClass: 'text-orange-400',
                description: 'Los tubérculos se forman y engordan bajo tierra. El calor y los días largos de verano canario favorecen la acumulación de almidones. El follaje puede seguir creciendo activamente.',
                tip: 'Reduce el riego a la mitad: el exceso de agua produce tubérculos grandes pero aguados y sin sabor. No fertilices con Nitrógeno ahora (produce más follaje y menos tubérculo).',
                characteristics: ['Tubérculos en formación (no visibles)', 'Guías maduras', 'Reducción del vigor del follaje', 'Flores moradas posibles'],
            },
            {
                id: 'harvest', daysFrom: 130, daysTo: null,
                label: 'Cosecha', icon: '🍠', colorClass: 'text-amber-600',
                description: 'La batata está lista en 120-150 días. El follaje comienza a amarillear como señal de madurez. En Canarias la cosecha suele ser en otoño tras una plantación de primavera.',
                tip: 'Cava con cuidado para no herir los tubérculos. Cura a 25-30 °C con alta humedad (85 %) durante 5-7 días: esto sella los cortes y desarrolla el sabor dulce. Sin curado, aguantan pocas semanas.',
                characteristics: ['Follaje amarilleando', 'Tubérculos naranjas/morados al cavar', 'Piel fina y delicada', 'Dulzor máximo tras el curado'],
            },
        ],
    },

};

// ---------------------------------------------------------------------------
// Pot volume recommendations (liters)
// ---------------------------------------------------------------------------

export interface PotVolume {
    min: number;
    recommended: number;
    max: number | null; // null = sin límite (suelo abierto ideal)
}

const POT_VOLUMES: Partial<Record<GeneticsType, PotVolume>> = {
    Auto:          { min: 11,  recommended: 18,  max: 25  },
    Feminizada:    { min: 15,  recommended: 30,  max: 50  },
    Tomato:        { min: 20,  recommended: 35,  max: null },
    Pepper:        { min: 10,  recommended: 22,  max: 40  },
    PepperCommon:  { min: 12,  recommended: 25,  max: 45  },
    PepperItalian: { min: 15,  recommended: 28,  max: 50  },
    PepperPadron:  { min: 8,   recommended: 20,  max: 35  },
    Aloe:          { min: 5,   recommended: 12,  max: 30  },
    Papaya:        { min: 30,  recommended: 60,  max: null },
    Mango:         { min: 50,  recommended: 90,  max: null },
    Basil:         { min: 2,   recommended: 7,   max: 15  },
    Mint:          { min: 3,   recommended: 10,  max: 20  },
    Lavender:      { min: 10,  recommended: 25,  max: 40  },
    Rosemary:      { min: 10,  recommended: 25,  max: 40  },
    Lemon:         { min: 30,  recommended: 60,  max: null },
    Strawberry:    { min: 5,   recommended: 12,  max: 20  },
    Potato:        { min: 20,  recommended: 50,  max: null },
    Lettuce:       { min: 5,   recommended: 12,  max: 20  },
    Cucumber:      { min: 15,  recommended: 28,  max: 50  },
    Zucchini:      { min: 30,  recommended: 45,  max: null },
    Watermelon:    { min: 30,  recommended: 60,  max: null },
    Onion:         { min: 10,  recommended: 18,  max: 30  },
    Garlic:        { min: 8,   recommended: 15,  max: 25  },
    SweetPotato:   { min: 25,  recommended: 45,  max: null },
    Parsley:       { min: 3,   recommended: 10,  max: 20  },
};

export function getPotVolume(genetics: GeneticsType): PotVolume {
    return POT_VOLUMES[genetics] ?? { min: 10, recommended: 20, max: null };
}

// ---------------------------------------------------------------------------
// Phase resolver
// ---------------------------------------------------------------------------

function waitPhase(label: string, desc: string): PlantPhaseInfo {
    return {
        id: 'wait',
        label,
        description: desc,
        icon: '⏳',
        tip: 'Introduce la fecha de siembra o trasplante en los ajustes para ver la fase actual.',
        characteristics: [],
        colorClass: 'text-muted-foreground',
        progress: 0,
    };
}

function resolvePhaseFromDays(daysSince: number, spec: PlantSpec): PlantPhaseInfo {
    for (const phase of spec.phases) {
        const inPhase =
            daysSince >= phase.daysFrom &&
            (phase.daysTo === null || daysSince < phase.daysTo);
        if (!inPhase) continue;

        const progress =
            phase.daysTo === null
                ? 100
                : Math.min(100, ((daysSince - phase.daysFrom) / (phase.daysTo - phase.daysFrom)) * 100);

        return {
            id: phase.id,
            label: phase.label,
            description: phase.description,
            icon: phase.icon,
            tip: phase.tip,
            characteristics: phase.characteristics,
            colorClass: phase.colorClass,
            progress,
        };
    }

    // Fallback: last phase
    const last = spec.phases[spec.phases.length - 1];
    return { id: last.id, label: last.label, description: last.description, icon: last.icon, tip: last.tip, characteristics: last.characteristics, colorClass: last.colorClass, progress: 100 };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export const getBotanyLogic = (
    genetics: GeneticsType,
    sowDate: string | null,
    dayOfYear: number,
    lightHours: number,
): GrowthState => {
    const isAuto = genetics === 'Auto';

    // Days since sow/transplant — future dates yield 0, no Math.abs
    const daysSince = sowDate
        ? Math.max(0, Math.floor((Date.now() - new Date(sowDate).getTime()) / 86_400_000))
        : 0;

    // ------------------------------------------------------------------
    // Cannabis Feminizada — photoperiod-driven (no sowDate needed)
    // ------------------------------------------------------------------
    if (genetics === 'Feminizada') {
        const isLengthening = dayOfYear < 182;
        const vegThreshold = 13.5;
        const flowerThreshold = 12.5;

        if (lightHours >= vegThreshold && isLengthening) {
            // Progress: 0 % at 13.5 h, 100 % at 13.8 h (Lanzarote max ≈ 13.8 h)
            const progress = Math.min(100, Math.max(0, ((lightHours - 13.5) / 0.3) * 100));
            return {
                isAuto: false,
                phase: {
                    id: 'vegetativo',
                    label: 'Vegetativo',
                    description: `Vigoroso crecimiento con ${lightHours.toFixed(1)} h de luz. Días en aumento hacia el solsticio.`,
                    icon: '🌿',
                    tip: 'Nitrógeno alto (N:P:K 3-1-2). Momento ideal para podas, LST y entrenamiento. No estreses con cambios bruscos de horario.',
                    characteristics: ['Crecimiento rápido', 'Internodos cortos y vigorosos', 'Hojas grandes y oscuras'],
                    colorClass: 'text-green-500',
                    progress,
                },
            };
        }

        if (lightHours >= flowerThreshold) {
            // Progress: 0 % at 13.5 h, 100 % at 12.5 h (as days shorten)
            const progress = Math.min(100, Math.max(0, ((13.5 - lightHours) / 1.0) * 100));
            return {
                isAuto: false,
                phase: {
                    id: 'prefloracion',
                    label: 'Pre-floración',
                    description: `Días acortándose (${lightHours.toFixed(1)} h). Inicio del estirón floral y aparición de pistilos blancos.`,
                    icon: '🌼',
                    tip: 'Transición a P-K alto. Detén las podas agresivas. Identifica y elimina posibles machos. Vigila el VPD.',
                    characteristics: ['Estiramiento vertical acelerado', 'Primeros pistilos blancos', 'Cálices visibles en nudos'],
                    colorClass: 'text-yellow-500',
                    progress,
                },
            };
        }

        if (lightHours >= 11.0) {
            // Progress: 0 % at 12.5 h, 100 % at 11.0 h
            const progress = Math.min(100, Math.max(0, ((12.5 - lightHours) / 1.5) * 100));
            return {
                isAuto: false,
                phase: {
                    id: 'floracion',
                    label: 'Floración Plena',
                    description: `Noches largas (${(24 - lightHours).toFixed(1)} h oscuridad). Los cogollos engordan y producen resina activamente.`,
                    icon: '🌸',
                    tip: 'P-K alto. Humedad <50 % para evitar Botrytis. Revisa cogollos densos con lupa. El viento Alisio ayuda a ventilar, pero puede deshidratar: equilibra.',
                    characteristics: ['Floración masiva y densa', 'Resina/tricomas visibles', 'Olor fuerte y distintivo', 'Pistilos cambiando de color'],
                    colorClass: 'text-purple-500',
                    progress,
                },
            };
        }

        return {
            isAuto: false,
            phase: {
                id: 'maduracion',
                label: 'Maduración',
                description: `Noches muy largas (${(24 - lightHours).toFixed(1)} h). Los tricomas indican el momento óptimo de cosecha: observa con lupa 30×.`,
                icon: '🍯',
                tip: 'Lavado de raíces 10-14 días antes de la cosecha. Ratio tricomas lechosos/ámbar 70/30 para efecto más energético, o espera más ámbar para efecto más sedante.',
                characteristics: ['Tricomas lechosos y ámbar', 'Hojas amarilleando (nitrógeno consumido)', 'Pistilos rojizos/marrones', 'Cosecha inminente'],
                colorClass: 'text-orange-500',
                progress: 90,
            },
        };
    }

    // ------------------------------------------------------------------
    // Cannabis Auto — days-since-based with 6 phases
    // ------------------------------------------------------------------
    if (isAuto) {
        if (!sowDate) return {
            isAuto: true,
            phase: waitPhase('Esperando Fecha de Siembra', 'Introduce la fecha de siembra de la autofloreciente.'),
        };

        if (daysSince < 7) return {
            isAuto: true,
            phase: {
                id: 'germ_auto', label: 'Germinación', icon: '🌱', colorClass: 'text-green-300',
                description: 'La semilla absorbe agua y la radícula emerge. Mantén humedad constante y temperatura 22-26 °C.',
                tip: 'Germina en vaso de agua 12-24 h o directamente en jiffy húmedo. No toques la radícula. El tiempo es valioso en las autos: actúa rápido.',
                characteristics: ['Radícula emergiendo', 'Cotiledones despegando', 'Fase de 5-7 días'],
                progress: (daysSince / 7) * 100,
            },
        };

        if (daysSince < 21) return {
            isAuto: true,
            phase: {
                id: 'seedling_auto', label: 'Plántula (Auto)', icon: '🪴', colorClass: 'text-green-400',
                description: `Día ${daysSince}. Primeras hojas verdaderas. Las autos tienen reloj biológico propio: NO las estres con podas, trasplantes ni cambios.`,
                tip: 'Sin podas, sin trasplantes, sin LST agresivo. Máxima luz desde el primer día (18-20 h si es en exterior con luz artificial). Sustrato ligero y bien drenado.',
                characteristics: ['Primeras hojas verdaderas', 'Tallo fino y delicado', 'Crecimiento rápido si hay luz suficiente'],
                progress: ((daysSince - 7) / 14) * 100,
            },
        };

        if (daysSince < 40) return {
            isAuto: true,
            phase: {
                id: 'veg_auto', label: 'Vegetativo (Auto)', icon: '🌿', colorClass: 'text-green-500',
                description: `Día ${daysSince}. Crecimiento vigoroso. Las autos comienzan a mostrar sus primeros pistilos blancos antes del día 30 normalmente.`,
                tip: 'LST suave (sin cortes). Nitrógeno moderado. El sol canario es ideal para las autos en exterior. Asegura riego regular: las raíces pequeñas se secan rápido.',
                characteristics: ['Crecimiento rápido', 'Primeros pistilos blancos emergiendo', 'Estructura compacta'],
                progress: ((daysSince - 21) / 19) * 100,
            },
        };

        if (daysSince < 65) return {
            isAuto: true,
            phase: {
                id: 'flow_auto', label: 'Floración (Auto)', icon: '🌸', colorClass: 'text-purple-500',
                description: `Día ${daysSince}. Cogollos engordando activamente. La planta dedica toda su energía a la producción de resina y flores.`,
                tip: 'Cambia a P-K alto. Humedad <50 % para evitar hongos. En Lanzarote el viento y el sol ayudan, pero vigila la calima: el polvo puede cubrir los tricomas.',
                characteristics: ['Cogollos densos en formación', 'Resina visible', 'Pistilos blancos abundantes', 'Olor fuerte'],
                progress: ((daysSince - 40) / 25) * 100,
            },
        };

        if (daysSince < 80) return {
            isAuto: true,
            phase: {
                id: 'mature_auto', label: 'Maduración (Auto)', icon: '🍯', colorClass: 'text-orange-500',
                description: `Día ${daysSince}. Fase final. Los tricomas están cambiando de transparentes a lechosos. Observa con lupa 30× para decidir el momento de cosecha.`,
                tip: 'Lavado de raíces 7-10 días antes de la cosecha (agua sola sin nutrientes). Ratio 70 % lechoso / 30 % ámbar para efecto equilibrado.',
                characteristics: ['Tricomas lechosos mayoritarios', 'Pistilos rojizos o marrones', 'Hojas amarilleando (normal)', 'Cogollos compactos y aromáticos'],
                progress: ((daysSince - 65) / 15) * 100,
            },
        };

        // Day 80+: urgent harvest
        return {
            isAuto: true,
            phase: {
                id: 'harvest_auto', label: '¡Cosecha Urgente! (Auto)', icon: '✂️', colorClass: 'text-red-500',
                description: `Día ${daysSince}. ¡Planta madura o posiblemente pasada! Si los tricomas están mayoritariamente ámbar, la calidad decrece con el tiempo. Cosecha ya.`,
                tip: 'Corta, cuelga boca abajo en lugar oscuro y ventilado a 18-20 °C y 50-55 % de humedad para el curado. El curado correcto dura 10-14 días mínimo.',
                characteristics: ['Tricomas mayormente ámbar', 'Hojas muy amarillas', 'Posible degradación de cannabinoides si se retrasa', 'Cogollos compactos'],
                progress: 100,
            },
        };
    }

    // ------------------------------------------------------------------
    // All other day-based plants
    // ------------------------------------------------------------------
    const spec = PLANTS[genetics];
    if (!spec) {
        return {
            isAuto: false,
            phase: { id: 'error', label: 'Planta no reconocida', description: 'Tipo de planta no configurado.', icon: '❓', tip: '', characteristics: [], colorClass: 'text-muted-foreground', progress: 0 },
        };
    }

    if (!sowDate) {
        return { isAuto: false, phase: waitPhase(spec.waitLabel, spec.waitDesc) };
    }

    return { isAuto: false, phase: resolvePhaseFromDays(daysSince, spec) };
};
