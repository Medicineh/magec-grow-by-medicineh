import type { GeneticsType } from '@/context/SettingsContext';

export interface Tip {
    id: number;
    category: 'consejo' | 'curiosidad' | 'guia';
    title: string;
    content: string;
    icon: string;
}

// ---------------------------------------------------------------------------
// Generic Canary Islands tips (used as fallback)
// ---------------------------------------------------------------------------
export const genericTips: Tip[] = [
    {
        id: 1,
        category: 'consejo',
        title: 'Riego eficiente',
        content: 'En Lanzarote, el viento seca la superficie rápido. Comprueba la humedad a 5 cm de profundidad antes de regar de nuevo.',
        icon: '💧'
    },
    {
        id: 2,
        category: 'curiosidad',
        title: 'Ceniza volcánica',
        content: 'El "picón" (lapilli) de Lanzarote actúa como aislante térmico y retiene la humedad de la noche (roce), vital para las plantas.',
        icon: '🌋'
    },
    {
        id: 3,
        category: 'consejo',
        title: 'Protección contra el viento',
        content: 'Usa muros de piedra seca (socos) para proteger tus cultivos del viento constante del noreste.',
        icon: '💨'
    },
    {
        id: 4,
        category: 'curiosidad',
        title: 'La Malvasía Volcánica',
        content: 'Las parras en La Geria se plantan en hoyos de hasta 3 metros de profundidad para buscar tierra fértil bajo la ceniza.',
        icon: '🍇'
    },
    {
        id: 5,
        category: 'consejo',
        title: 'Luz solar extrema',
        content: 'Durante el verano, el índice UV en Canarias es extremo. Una malla de sombreo del 30% puede evitar quemaduras en hojas jóvenes.',
        icon: '☀️'
    },
    {
        id: 6,
        category: 'curiosidad',
        title: 'Humedad del alisio',
        content: 'Los vientos Alisios traen humedad que las plantas de cumbre aprovechan como "lluvia horizontal".',
        icon: '☁️'
    },
    {
        id: 7,
        category: 'consejo',
        title: 'Punto de rocío',
        content: 'Si la temperatura baja mucho y se acerca al punto de rocío, la humedad se condensará en las hojas, aumentando el riesgo de hongos.',
        icon: '🌡️'
    },
    {
        id: 8,
        category: 'curiosidad',
        title: 'Plantas autóctonas',
        content: 'Muchas plantas canarias como el Verode han evolucionado para almacenar agua en sus tallos y resistir sequías prolongadas.',
        icon: '🌵'
    },
    {
        id: 9,
        category: 'consejo',
        title: 'Esquejes y calima',
        content: 'Durante la calima, aumenta la humedad ambiental de tus esquejes. El aire seco y el polvo pueden estresar los cortes recién hechos.',
        icon: '🌫️'
    },
    {
        id: 10,
        category: 'curiosidad',
        title: 'Fuerza del alisio',
        content: 'Los esquejes en Lanzarote necesitan protección extra; una ráfaga fuerte puede deshidratarlos en minutos si no están en propagador.',
        icon: '🌪️'
    },
];

// ---------------------------------------------------------------------------
// Plant-specific tips
// ---------------------------------------------------------------------------
const PLANT_TIPS: Record<GeneticsType, Tip[]> = {
    Auto: [
        {
            id: 101,
            category: 'consejo',
            title: 'Ciclo de luz 20/4',
            content: 'Las autoflorecientes en Canarias responden bien a 20 horas de luz. En verano el sol aporta 14-15h; complementa con luz artificial el resto para maximizar producción.',
            icon: '💡'
        },
        {
            id: 102,
            category: 'guia',
            title: 'Sin trasplante',
            content: 'Siembra directamente en maceta definitiva (mínimo 15L). Las autos no toleran estrés de trasplante; cualquier retraso acorta el tiempo en vegetativo sin recuperación posible.',
            icon: '🪴'
        },
        {
            id: 103,
            category: 'consejo',
            title: 'Nutrición progresiva',
            content: 'Semanas 1-3: solo agua o muy poca nutrición. Semanas 4-6: N alto para crecer. Semanas 7-9: reduce N, aumenta PK para flores. Semana 10+: lavado de raíces con agua pura.',
            icon: '🌿'
        },
        {
            id: 104,
            category: 'consejo',
            title: 'Calima y autofloreciente',
            content: 'Durante la calima, la auto puede mostrar hojas hacia arriba ("praying"). Riega más frecuente y añade hidratación foliar a primera hora de la mañana antes del calor.',
            icon: '🌫️'
        },
        {
            id: 105,
            category: 'guia',
            title: 'Cosecha por tricomas',
            content: 'Usa lupa 60x: tricomas blancos lechosos = máximo THC. Ámbar = CBD y efecto sedante. Para efecto equilibrado, cosecha al 20-30% ámbar. En Lanzarote el calor acelera la maduración.',
            icon: '🔬'
        },
        {
            id: 106,
            category: 'consejo',
            title: 'Viento canario',
            content: 'El alisio fortalece los tallos con microvibración, pero rachas >40 km/h en floración pueden partir ramas cargadas. Tutora con cañas de bambú o instala una red de apoyo.',
            icon: '💨'
        },
    ],
    Feminizada: [
        {
            id: 201,
            category: 'guia',
            title: 'Photoperiodo en Lanzarote',
            content: 'Las fotoperiodicas florecen cuando la luz cae por debajo de 13,5 horas. En Lanzarote esto ocurre a partir de agosto-septiembre. Planifica la siembra en marzo-abril para aprovechar el vegetativo primaveral.',
            icon: '📅'
        },
        {
            id: 202,
            category: 'consejo',
            title: 'Poda apical (FIM/LST)',
            content: 'En semana 3-4 aplica poda apical: corta el 80% del brote principal. Esto crea 2-4 colas dominantes y aumenta la producción. Combina con LST (Low Stress Training) para una dosel uniforme.',
            icon: '✂️'
        },
        {
            id: 203,
            category: 'consejo',
            title: 'Pregerminación en interior',
            content: 'Germina en interior en enero-febrero. Cuando el exterior supere 12h de luz (marzo), pasa al exterior. Así aprovechas los meses de mayor fotoperiodo para el vegetativo.',
            icon: '🌱'
        },
        {
            id: 204,
            category: 'guia',
            title: 'Control de humedad en floración',
            content: 'Durante floración, mantén la humedad relativa por debajo del 50%. El alisio ayuda, pero en zonas calmas o invernaderos puede acumularse Botrytis. Inspecciona los cogollos cada 3 días.',
            icon: '💧'
        },
        {
            id: 205,
            category: 'consejo',
            title: 'Lavado de raíces',
            content: 'Las últimas 2 semanas antes de cosecha riega solo con agua para eliminar sales acumuladas. En sustrato mineral el lavado mejora notablemente el sabor y la combustión.',
            icon: '🌊'
        },
        {
            id: 206,
            category: 'curiosidad',
            title: 'Resinas y UV',
            content: 'El sol intenso de Canarias estimula la producción de tricomas como mecanismo de protección UV. Cultivos en exterior en Lanzarote suelen mostrar una capa de resina superior a cultivos en regiones más nubladas.',
            icon: '✨'
        },
    ],
    Tomato: [
        {
            id: 301,
            category: 'consejo',
            title: 'Destallado semanal',
            content: 'Elimina los "chupones" que nacen en la axila entre tallo principal y rama. Hazlo cuando son pequeños (5-7 cm) para no estresar la planta. Deja 1-2 tallos principales.',
            icon: '✂️'
        },
        {
            id: 302,
            category: 'consejo',
            title: 'Riego en Canarias',
            content: 'El tomate consume 3-5 litros diarios en verano canario. Riega a pie de planta al amanecer. Evita mojar las hojas para reducir el riesgo de mildiu y alternaria.',
            icon: '💧'
        },
        {
            id: 303,
            category: 'guia',
            title: 'Nutrición NPK',
            content: 'Trasplante a fructificación: N alto (20-10-10). Floración: equilibrado (10-10-10). Maduración: PK alto (5-20-30). Añade calcio en Canarias si el agua es blanda para prevenir la podredumbre apical.',
            icon: '🧪'
        },
        {
            id: 304,
            category: 'consejo',
            title: 'Polinización manual',
            content: 'En interior o con poco viento, sacude suavemente los ramilletes florales a mediodía para favorecer la polinización. Mejora el cuajado hasta un 40% en comparación con plantas sin agitar.',
            icon: '🐝'
        },
        {
            id: 305,
            category: 'curiosidad',
            title: 'Tomate canario',
            content: 'Las variedades locales como el "Tomate de Palo" están adaptadas al clima árido canario y necesitan menos agua que las variedades continentales. Busca semillas locales en los mercadillos.',
            icon: '🍅'
        },
    ],
    Pepper: [
        {
            id: 401,
            category: 'consejo',
            title: 'Calor y pimiento',
            content: 'El pimiento necesita temperaturas mínimas de 15°C para cuajar bien. En Lanzarote es ideal de abril a noviembre. Si hay noches frías, cubre con agrotextil.',
            icon: '🌡️'
        },
        {
            id: 402,
            category: 'consejo',
            title: 'Poda inicial',
            content: 'Elimina las primeras flores que aparezcan antes de que la planta tenga 20 cm de altura. Esto fuerza a la planta a desarrollar más ramas y produce una cosecha final mucho mayor.',
            icon: '✂️'
        },
        {
            id: 403,
            category: 'guia',
            title: 'Variedades picantes',
            content: 'El picor (capsaicina) aumenta con el estrés hídrico controlado. Durante la maduración, reduce el riego un 20% para concentrar capsaicina. Cuidado: el estrés excesivo causa caída de frutos.',
            icon: '🌶️'
        },
        {
            id: 404,
            category: 'consejo',
            title: 'Pulgones y calima',
            content: 'La calima puede debilitar los pimientos y atraer pulgones. Aplica jabón potásico o aceite de neem preventivamente cuando se avise de episodios de calima.',
            icon: '🐛'
        },
    ],
    Cucumber: [
        {
            id: 501,
            category: 'consejo',
            title: 'Tutorado vertical',
            content: 'El pepino rinde mejor tutorado verticalmente (red o espalderas). Guía el tallo principal y poda los brotes laterales por debajo del tercer nudo para activar mejor circulación de aire.',
            icon: '🪜'
        },
        {
            id: 502,
            category: 'consejo',
            title: 'Riego constante',
            content: 'El pepino es 95% agua. En verano canario necesita riego diario. La falta de agua produce frutos amargos. Mantén la humedad del sustrato por encima del 60% siempre.',
            icon: '💧'
        },
        {
            id: 503,
            category: 'guia',
            title: 'Cosecha frecuente',
            content: 'Cosecha los pepinos cada 2-3 días cuando midan 15-20 cm. Dejar frutos muy grandes agota la planta y reduce la producción total. Cada fruto cosechado estimula la aparición de nuevas flores.',
            icon: '🥒'
        },
        {
            id: 504,
            category: 'consejo',
            title: 'Oídio en verano',
            content: 'El pepino es muy susceptible al oídio (polvo blanco). En el calor seco de Lanzarote rocía con solución de bicarbonato (5g/L) de forma preventiva cada 2 semanas.',
            icon: '🍃'
        },
    ],
    Zucchini: [
        {
            id: 601,
            category: 'consejo',
            title: 'Polinización manual',
            content: 'El calabacín tiene flores macho y hembra separadas. Si hay pocas abejas (común en zonas urbanas de Lanzarote), usa un pincel suave para transferir polen de la flor macho a la hembra por la mañana.',
            icon: '🌸'
        },
        {
            id: 602,
            category: 'consejo',
            title: 'Cosecha pequeño',
            content: 'Cosecha cuando midan 15-20 cm. Los calabacines dejados crecer consumen toda la energía de la planta. Una planta bien manejada produce 10-15 frutos por temporada en Canarias.',
            icon: '🥬'
        },
        {
            id: 603,
            category: 'consejo',
            title: 'Espacio suficiente',
            content: 'Cada planta de calabacín necesita al menos 1 m² de espacio. En maceta, usa recipientes de mínimo 40 litros. La raíz extensa necesita espacio para absorber agua en el suelo volcánico.',
            icon: '📐'
        },
    ],
    Watermelon: [
        {
            id: 701,
            category: 'guia',
            title: 'Suelo volcánico ideal',
            content: 'La sandía adora el drenaje excelente del suelo volcánico canario. Mezcla picón con tierra rica en materia orgánica (50/50). El suelo bien drenado previene la pudrición de raíces en el calor.',
            icon: '🌋'
        },
        {
            id: 702,
            category: 'consejo',
            title: 'Detección de madurez',
            content: 'Golpea la sandía: sonido hueco = madura. Observa también la "mancha de campo" (zona amarilla donde toca el suelo): cuando pasa de blanca a amarilla intensa, está lista.',
            icon: '🍉'
        },
        {
            id: 703,
            category: 'consejo',
            title: 'Un fruto por planta',
            content: 'Para sandías de calidad, deja solo 1-2 frutos por planta. Cuando el fruto alcanza el tamaño de un puño, elimina los demás. La planta concentrará azúcares en los frutos seleccionados.',
            icon: '✂️'
        },
        {
            id: 704,
            category: 'consejo',
            title: 'Riego en maduración',
            content: 'Las últimas 2 semanas antes de cosechar, reduce el riego a la mitad. El estrés hídrico concentra los azúcares y mejora el sabor de la pulpa notablemente.',
            icon: '💧'
        },
    ],
    Potato: [
        {
            id: 801,
            category: 'consejo',
            title: 'Aporcado progresivo',
            content: 'Cuando la planta alcance 20 cm, cubre la mitad del tallo con tierra (aporcado). Repite 2-3 veces. Esto genera más tubérculos y los protege de la luz solar que los vuelve verdes y tóxicos.',
            icon: '🥔'
        },
        {
            id: 802,
            category: 'consejo',
            title: 'Siembra en Canarias',
            content: 'Las papas en Lanzarote se siembran en septiembre-octubre para cosecha en diciembre-febrero. El invierno suave evita heladas y la lluvia de otoño reduce la necesidad de riego.',
            icon: '📅'
        },
        {
            id: 803,
            category: 'curiosidad',
            title: 'Papa canaria',
            content: 'Las variedades autóctonas canarias como la "Papa Bonita" o "Negra" tienen mayor concentración de materia seca y sabor superior. Son más resistentes a la sequía que las variedades comerciales.',
            icon: '🌟'
        },
        {
            id: 804,
            category: 'consejo',
            title: 'Cosecha en seco',
            content: 'Deja de regar 2 semanas antes de cosechar. La piel de los tubérculos se endurecerá y durarán más tiempo almacenados. Cosecha con suelo seco para evitar magulladuras.',
            icon: '🌾'
        },
    ],
    SweetPotato: [
        {
            id: 901,
            category: 'guia',
            title: 'Propagación por esquejes',
            content: 'La batata se propaga fácilmente por esquejes. Coloca un tubérculo en agua hasta que brote. Cuando los brotes tengan 15 cm, córtalos y plántalos directamente en tierra cálida.',
            icon: '🍠'
        },
        {
            id: 902,
            category: 'consejo',
            title: 'Calor esencial',
            content: 'La batata necesita suelos a más de 18°C para crecer bien. En Lanzarote, el suelo volcánico oscuro se calienta rápidamente. Siembra desde mayo hasta agosto para mejores resultados.',
            icon: '🌡️'
        },
        {
            id: 903,
            category: 'consejo',
            title: 'Cubrición del suelo',
            content: 'Las plantas de batata cubren el suelo rápidamente reduciendo la evaporación. Esta característica es muy útil en el clima árido de Lanzarote; aprovéchala para ahorrar agua en cultivos cercanos.',
            icon: '🍃'
        },
    ],
    Lettuce: [
        {
            id: 1001,
            category: 'consejo',
            title: 'Semisombra en verano',
            content: 'La lechuga en Lanzarote sufre en pleno sol de verano (>28°C): se "espiga" (estira y amarga). Plántala donde reciba sol de mañana y semisombra de tarde, o usa una malla del 30%.',
            icon: '☀️'
        },
        {
            id: 1002,
            category: 'consejo',
            title: 'Cosecha de hojas externas',
            content: 'En vez de cosechar toda la lechuga, corta las hojas externas y deja el corazón. La planta seguirá produciendo hojas durante semanas. En Lanzarote este método puede durar meses en otoño-invierno.',
            icon: '🥬'
        },
        {
            id: 1003,
            category: 'guia',
            title: 'Ciclo invernal ideal',
            content: 'El mejor ciclo en Canarias es septiembre-febrero: temperaturas suaves, menos plagas, sin riesgo de espigado. Una lechuga bien gestionada puede dar hasta 4 cosechas de hojas en un ciclo.',
            icon: '📅'
        },
    ],
    Onion: [
        {
            id: 1101,
            category: 'consejo',
            title: 'Profundidad de siembra',
            content: 'Planta los bulbillos a 2-3 cm de profundidad con la punta hacia arriba. Mayor profundidad retrasa la emergencia y puede pudrir el cuello. En picón volcánico es mejor criar en macetero y trasplantar.',
            icon: '🧅'
        },
        {
            id: 1102,
            category: 'consejo',
            title: 'Señal de madurez',
            content: 'Cuando el tallo superior se dobla de forma natural y se amarillea, la cebolla está madura. En Lanzarote esto suele ocurrir en junio-julio si se plantó en otoño. Deja curar al sol 1-2 semanas antes de guardar.',
            icon: '🌾'
        },
        {
            id: 1103,
            category: 'guia',
            title: 'Malas hierbas',
            content: 'La cebolla tiene raíces superficiales y compite mal con las malas hierbas. Deshierba con frecuencia a mano o con azada superficial para no dañar las raíces. El picón como mulch también frena el crecimiento de hierbas.',
            icon: '🌿'
        },
    ],
    Garlic: [
        {
            id: 1201,
            category: 'guia',
            title: 'Dientes orientados hacia arriba',
            content: 'Separa los dientes y plántalos con la punta hacia arriba a 3-4 cm de profundidad, separados 15 cm entre sí. La vernalización (frío) mejora el tamaño del bulbo; planta en octubre-noviembre en Canarias.',
            icon: '🧄'
        },
        {
            id: 1202,
            category: 'consejo',
            title: 'Escapos florales',
            content: 'Si el ajo emite un tallo con flor (escapo), córtalo inmediatamente. Si lo dejas, la planta destinará energía a la semilla en vez del bulbo. Los escapos son comestibles y deliciosos salteados.',
            icon: '✂️'
        },
        {
            id: 1203,
            category: 'consejo',
            title: 'Cosecha y curado',
            content: 'Cosecha cuando las 2-3 hojas inferiores se sequen (mayo-junio en Canarias). Deja curar a la sombra con buena ventilación 3-4 semanas. Un buen curado prolonga la conservación de 6-12 meses.',
            icon: '☀️'
        },
    ],
    Strawberry: [
        {
            id: 1301,
            category: 'consejo',
            title: 'Estolones y reproducción',
            content: 'La fresa produce estolones (tallos rastreros) con plantitas nuevas. En verano, deja que enraícen en macetitas para multiplicar tu cultivo sin coste. En otoño, corta el estolón y tienes una planta nueva.',
            icon: '🍓'
        },
        {
            id: 1302,
            category: 'consejo',
            title: 'Fresas en altura',
            content: 'Cultiva en maceteros colgantes o "torres de fresas". El suelo volcánico ácido de Lanzarote es adecuado. Mantén pH 6.0-6.5. El fruto cuelga libre y no toca el suelo, reduciendo podredumbres.',
            icon: '🪴'
        },
        {
            id: 1303,
            category: 'guia',
            title: 'Nutrición de fresas',
            content: 'Pre-floración: N moderado. Floración y fructificación: aumenta K para dulzor y tamaño. Añade calcio y magnesio para prevenir necrosis marginal de hojas. Riega con agua de pH ajustado a 6.0.',
            icon: '🧪'
        },
    ],
    Lemon: [
        {
            id: 1401,
            category: 'consejo',
            title: 'Poda de formación',
            content: 'El primer año, forma un esqueleto de 3-4 ramas principales eliminando lo que crezca hacia el interior o hacia abajo. Un árbol bien formado es más fácil de manejar y recibe mejor la luz solar directa.',
            icon: '✂️'
        },
        {
            id: 1402,
            category: 'consejo',
            title: 'Riego y sequía',
            content: 'El limonero es resistente pero en pleno verano canario riega 2-3 veces por semana. El estrés hídrico prolongado provoca caída de frutos. Mulch de picón volcánico reduce la evaporación del suelo.',
            icon: '💧'
        },
        {
            id: 1403,
            category: 'curiosidad',
            title: 'Floración escalonada',
            content: 'En Lanzarote el limonero puede florecer 3 veces al año gracias al clima templado. Esto significa que puedes tener frutos en diferentes estados de madurez simultáneamente en el mismo árbol.',
            icon: '🌸'
        },
    ],
    Mango: [
        {
            id: 1501,
            category: 'consejo',
            title: 'Protección de heladas',
            content: 'El mango no tolera temperaturas por debajo de 4°C. En Lanzarote las heladas son raras, pero en inviernos fríos cubre los árboles jóvenes con agrotextil en las noches más frías de enero.',
            icon: '🥭'
        },
        {
            id: 1502,
            category: 'guia',
            title: 'Floración y lluvia',
            content: 'La lluvia durante la floración del mango provoca enfermedades fúngicas en las panículas. En Lanzarote la lluvia es escasa, ventaja para este frutal tropical. Evita el riego por aspersión en floración.',
            icon: '🌸'
        },
        {
            id: 1503,
            category: 'consejo',
            title: 'Poda post-cosecha',
            content: 'Poda el mango justo después de la cosecha. Elimina ramas que se cruzcan y acorta las principales un 30%. La nueva brotación en otoño será la que dé frutos el próximo año.',
            icon: '✂️'
        },
    ],
    Papaya: [
        {
            id: 1601,
            category: 'consejo',
            title: 'Drenaje perfecto',
            content: 'La papaya muere con los pies mojados. En Lanzarote planta en montículos elevados sobre el nivel del suelo o en macetones con 50% picón para garantizar drenaje perfecto incluso en lluvias inusuales.',
            icon: '💧'
        },
        {
            id: 1602,
            category: 'consejo',
            title: 'Sexado de plantas',
            content: 'La papaya tiene plantas macho, hembra y hermafrodita. Las hermafroditas producen solos (sin necesitar polinizador). Identifica el sexo a los 3-4 meses por la forma de las flores: hembra = flores solitarias grandes.',
            icon: '🌺'
        },
        {
            id: 1603,
            category: 'guia',
            title: 'Calor y viento',
            content: 'La papaya necesita calor pero es sensible al viento fuerte. En Lanzarote, ubícala en zonas protegidas del alisio (detrás de muros o socos). Las hojas grandes actúan como vela y pueden arrancar la planta.',
            icon: '💨'
        },
    ],
    Basil: [
        {
            id: 1701,
            category: 'consejo',
            title: 'Pinzado frecuente',
            content: 'Pinza o corta las puntas florales en cuanto aparezcan. Si la albahaca florece, las hojas se vuelven pequeñas y amargas. El corte frecuente estimula la ramificación y mantiene la planta productiva más tiempo.',
            icon: '✂️'
        },
        {
            id: 1702,
            category: 'guia',
            title: 'Esquejes de albahaca',
            content: 'Corta un tallo de 10-15 cm por debajo de un nudo. Elimina las hojas inferiores y coloca en un vaso de agua al sol. En 7-10 días tendrás raíces. Planta en tierra cuando las raíces superen 2 cm. En verano canario es muy fácil.',
            icon: '🌿'
        },
        {
            id: 1703,
            category: 'consejo',
            title: 'Riego y calor',
            content: 'La albahaca ama el calor pero el sustrato debe mantenerse húmedo. En el verano de Lanzarote riega a diario y coloca en semisombra de tarde para evitar que las hojas se quemen a más de 35°C.',
            icon: '☀️'
        },
    ],
    Mint: [
        {
            id: 1801,
            category: 'consejo',
            title: 'Contención de raíces',
            content: 'La menta invade todos los espacios disponibles con sus estolones subterráneos. Siémbrala siempre en maceta o entierra la maceta en el suelo para frenar su expansión. En Lanzarote se propaga aún más rápido por el calor.',
            icon: '🫖'
        },
        {
            id: 1802,
            category: 'guia',
            title: 'Humedad y semisombra',
            content: 'La menta prefiere semisombra y suelo húmedo. En el clima árido de Lanzarote riega cada 1-2 días. Si el sustrato se seca completamente, las hojas pierden aceites esenciales y reducen su aroma.',
            icon: '💧'
        },
        {
            id: 1803,
            category: 'consejo',
            title: 'Cosecha para aceites esenciales',
            content: 'Cosecha las hojas por la mañana temprano, justo antes de que florezca. Es cuando la concentración de mentol y aceites esenciales está al máximo. Sécalas a la sombra para conservar el aroma.',
            icon: '🌿'
        },
    ],
    Lavender: [
        {
            id: 1901,
            category: 'consejo',
            title: 'Suelo seco y alcalino',
            content: 'La lavanda odia los pies mojados y prefiere pH 6.5-8.0. El suelo volcánico basáltico de Lanzarote tiene pH ligeramente alcalino y buen drenaje: condiciones casi perfectas. Añade arena si el suelo es arcilloso.',
            icon: '💜'
        },
        {
            id: 1902,
            category: 'consejo',
            title: 'Poda anual esencial',
            content: 'Poda la lavanda 1/3 de su tamaño tras la floración. Sin poda se vuelve leñosa y reduce su producción floral. Nunca cortes en madera vieja gris: corta solo en la parte verde y joven.',
            icon: '✂️'
        },
        {
            id: 1903,
            category: 'curiosidad',
            title: 'Lavanda y viento',
            content: 'La lavanda es resistente al viento alisio de Lanzarote, lo que la hace excelente como planta cortavientos en jardines de cultivo. Su olor repele además algunos insectos perjudiciales.',
            icon: '💨'
        },
    ],
    Rosemary: [
        {
            id: 2001,
            category: 'consejo',
            title: 'Esquejes de romero',
            content: 'Corta tallos semileñosos de 10 cm en primavera o otoño. Elimina las hojas del tercio inferior y clava en arena húmeda o perlita. Tapa con bolsa transparente para mantener humedad. Enraíza en 3-4 semanas.',
            icon: '🌿'
        },
        {
            id: 2002,
            category: 'consejo',
            title: 'Resistencia canaria',
            content: 'El romero es una de las plantas más resistentes al viento y sequía de Canarias. Una vez establecido, riega solo en los meses más secos. El exceso de agua es su principal enemigo.',
            icon: '💧'
        },
        {
            id: 2003,
            category: 'curiosidad',
            title: 'Cosecha continua',
            content: 'Cosecha siempre cortando los extremos de las ramas activas. Esto estimula el crecimiento lateral y mantiene la planta compacta. Las ramas muy viejas y leñosas tienen menos aceites esenciales.',
            icon: '✂️'
        },
    ],
    Aloe: [
        {
            id: 2101,
            category: 'consejo',
            title: 'Riego mínimo',
            content: 'El aloe almacena agua en sus hojas. En Lanzarote riega máximo 2 veces por mes en invierno y 1 vez por semana en verano. Si las hojas se arrugan ligeramente, es señal de que necesita agua.',
            icon: '💧'
        },
        {
            id: 2102,
            category: 'guia',
            title: 'Propagación por hijuelos',
            content: 'El aloe produce hijuelos (plantas bebé) alrededor de la base. Cuando tengan 10-15 cm, sepáralos con una pala limpia, deja curar el corte 2 días al aire y planta en sustrato para cactus. Facilísimo en el clima seco de Lanzarote.',
            icon: '🌵'
        },
        {
            id: 2103,
            category: 'curiosidad',
            title: 'Aloe vera canario',
            content: 'Las Islas Canarias son uno de los principales productores mundiales de Aloe vera comercial. La variedad Aloe barbadensis miller crece especialmente bien en el suelo volcánico basáltico y el sol intenso de las islas.',
            icon: '🌍'
        },
    ],

    Parsley: [
        {
            id: 2201,
            category: 'consejo',
            title: 'Germinación lenta',
            content: 'El perejil tarda 14-21 días en germinar. Remoja las semillas en agua tibia 12 horas antes de sembrar para acelerarlo. La falta de paciencia en esta fase es el error más común.',
            icon: '🌿'
        },
        {
            id: 2202,
            category: 'consejo',
            title: 'Cosecha correcta',
            content: 'Corta siempre las hojas externas más viejas, dejando el corazón central intacto. Así el perejil se renueva continuamente. Nunca cortes más del 30% de la planta de una vez.',
            icon: '✂️'
        },
        {
            id: 2203,
            category: 'guia',
            title: 'Perejil perenne en Canarias',
            content: 'En el clima suave canario el perejil puede producir todo el año durante 12-18 meses. Cuando sube a flor y produce semillas, recógelas para la próxima siembra. Es bianual.',
            icon: '📅'
        },
        {
            id: 2204,
            category: 'consejo',
            title: 'Humedad clave',
            content: 'El perejil necesita humedad constante en el suelo. En el clima árido de Lanzarote riega cada 1-2 días. Si el sustrato se seca, las hojas amarillean y pierden aroma rápidamente.',
            icon: '💧'
        },
    ],
    PepperCommon: [
        {
            id: 2301,
            category: 'consejo',
            title: 'Pimiento común en Canarias',
            content: 'El pimiento común (morrón) se adapta perfectamente al clima canario. Planta en abril-mayo para cosecha en verano-otoño. Puede producir frutos hasta noviembre en Lanzarote.',
            icon: '🫑'
        },
        {
            id: 2302,
            category: 'guia',
            title: 'Viraje de color',
            content: 'El pimiento verde y el rojo son el mismo fruto en distinto estado de madurez. El viraje de verde a rojo tarda 2-3 semanas. El rojo tiene el doble de vitamina C y es más dulce.',
            icon: '🔴'
        },
        {
            id: 2303,
            category: 'consejo',
            title: 'BER (podredumbre apical)',
            content: 'El extremo del pimiento se pudre si falta calcio o el riego es irregular. En Canarias el agua puede ser dura o blanda según la fuente; ajusta el pH a 6.5 y riega de forma uniforme.',
            icon: '⚠️'
        },
    ],
    PepperItalian: [
        {
            id: 2401,
            category: 'consejo',
            title: 'Tutorado esencial',
            content: 'Los pimientos italianos son largos y pesados. Tutora cada rama con caña o hilo desde el inicio. Con el viento Alisio, una rama cargada puede partirse sin soporte adecuado.',
            icon: '🪜'
        },
        {
            id: 2402,
            category: 'guia',
            title: 'Secado al sol canario',
            content: 'Los pimientos italianos rojos secos al sol canario producen un pimentón dulce artesanal excepcional. Cuélgalos en ristras en un lugar soleado y ventilado durante 3-4 semanas.',
            icon: '☀️'
        },
        {
            id: 2403,
            category: 'consejo',
            title: 'Carne gruesa para asar',
            content: 'El pimiento italiano destaca asado. Su carne gruesa y dulce se carameliza perfectamente. En Canarias se pueden asar directamente en brasa de leña o sobre la tapa de un bidón perforado.',
            icon: '🔥'
        },
    ],
    PepperPadron: [
        {
            id: 2501,
            category: 'curiosidad',
            title: 'El misterio del picor',
            content: 'El famoso "unos pican y otros no" se debe al estrés hídrico: pimientos con menos agua acumulan más capsaicina. En Canarias, con la sequía natural, los padrón pueden ser más picantes que en Galicia.',
            icon: '🌶️'
        },
        {
            id: 2502,
            category: 'consejo',
            title: 'Cosecha en verde pequeño',
            content: 'Cosecha los pimientos de Padrón cuando midan 4-6 cm para que sean mayoritariamente suaves. Si esperan a 7-8 cm el porcentaje de picantes aumenta considerablemente. ¡Sorpresa garantizada!',
            icon: '✂️'
        },
        {
            id: 2503,
            category: 'guia',
            title: 'Muy productivo en maceta',
            content: 'Una maceta de 25 litros puede producir más de 1 kg de pimientos de Padrón en una temporada. Ideal para terrazas y balcones canarios. Riega con moderación para mantener algo de picor.',
            icon: '🪴'
        },
    ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getPlantTips(genetics: GeneticsType): Tip[] {
    return PLANT_TIPS[genetics] ?? genericTips;
}

export function getPlantDailyTip(genetics: GeneticsType): Tip {
    const tips = getPlantTips(genetics);
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return tips[dayOfYear % tips.length];
}

export function getPlantRandomTip(genetics: GeneticsType): Tip {
    const tips = getPlantTips(genetics);
    return tips[Math.floor(Math.random() * tips.length)];
}

// Legacy exports for backward compatibility
export const cultivationTips = genericTips;

export function getRandomTip(): Tip {
    return genericTips[Math.floor(Math.random() * genericTips.length)];
}

export function getDailyTip(): Tip {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return genericTips[dayOfYear % genericTips.length];
}
