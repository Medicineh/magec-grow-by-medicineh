export interface Tip {
    id: number;
    category: 'consejo' | 'curiosidad';
    title: string;
    content: string;
    icon: string;
}

export const cultivationTips: Tip[] = [
    {
        id: 1,
        category: 'consejo',
        title: 'Riego eficiente',
        content: 'En Lanzarote, el viento seca la superficie rápido. Comprueba la humedad a 5cm de profundidad antes de regar de nuevo.',
        icon: '💧'
    },
    {
        id: 2,
        category: 'curiosidad',
        title: 'Ceniza Volcánica',
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
        title: 'Luz Solar',
        content: 'Durante el verano, el índice UV en Canarias es extremo. Una malla de sombreo del 30% puede evitar quemaduras en hojas jóvenes.',
        icon: '☀️'
    },
    {
        id: 6,
        category: 'curiosidad',
        title: 'Humedad del Alisio',
        content: 'Los vientos Alisios traen humedad que las plantas de cumbre aprovechan como "lluvia horizontal".',
        icon: '☁️'
    },
    {
        id: 7,
        category: 'consejo',
        title: 'Punto de Rocío',
        content: 'Si la temperatura baja mucho y se acerca al punto de rocío, la humedad se condensará en las hojas, aumentando el riesgo de hongos.',
        icon: '🌡️'
    },
    {
        id: 8,
        category: 'curiosidad',
        title: 'Plantas Autóctonas',
        content: 'Muchas plantas canarias como el Verode han evolucionado para almacenar agua en sus tallos y resistir sequías prolongadas.',
        icon: '🌵'
    },
    {
        id: 9,
        category: 'consejo',
        title: 'Esquejes y Calima',
        content: 'Durante la calima, aumenta la humedad ambiental de tus esquejes. El aire seco y el polvo pueden estresar los cortes recién hechos.',
        icon: '🌫️'
    },
    {
        id: 10,
        category: 'curiosidad',
        title: 'Fuerza del Alisio',
        content: 'Los esquejes en Lanzarote necesitan protección extra; una ráfaga fuerte puede deshidratarlos en minutos si no están en propagador.',
        icon: '🌪️'
    }
];

export function getRandomTip(): Tip {
    const randomIndex = Math.floor(Math.random() * cultivationTips.length);
    return cultivationTips[randomIndex];
}

export function getDailyTip(): Tip {
    // Use current date to pick a consistent tip for the day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return cultivationTips[dayOfYear % cultivationTips.length];
}
