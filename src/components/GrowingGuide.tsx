import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Scissors, Sprout, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Section {
    id: string;
    title: string;
    icon: string;
    content: React.ReactNode;
}

function GerminationGuide() {
    return (
        <div className="space-y-4 text-sm text-foreground/80">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">¿Qué es la germinación?</h4>
                <p>La germinación es el proceso por el que una semilla latente absorbe agua, activa sus enzimas y produce una radícula (raíz embrionaria). Solo necesita humedad, temperatura adecuada y, en la mayoría de los casos, oscuridad.</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">🌊 Método 1: Vaso de agua</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Coloca las semillas en un vaso de agua a 22-25 °C</li>
                    <li>Espera 12-24 horas hasta que la radícula sea visible (2-3 mm)</li>
                    <li>Traslada con cuidado a sustrato usando pinzas — no toques la radícula</li>
                    <li>Planta con la radícula hacia abajo, a 1 cm de profundidad</li>
                </ol>
                <p className="text-xs text-amber-600 mt-1">⚠️ No uses este método más de 24 horas: el exceso de agua puede ahogar la semilla.</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">🧻 Método 2: Papel húmedo (recomendado)</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Humedece papel de cocina (sin aromas) y escúrrelo bien</li>
                    <li>Coloca las semillas y dobla el papel sobre ellas</li>
                    <li>Mete en una bolsa con zip o entre dos platos en lugar cálido y oscuro</li>
                    <li>Comprueba cada 12 horas. Cuando la radícula tenga 1-2 cm, planta</li>
                </ol>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">🌱 Método 3: Directamente en tierra</h4>
                <p className="text-muted-foreground">Introduce la semilla a 0.5-1 cm de profundidad en sustrato húmedo y cálido. Cubre con una bolsa o cúpula de plástico para mantener la humedad. Más lento pero menos estrés al trasplante.</p>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">¿Por qué algunas semillas tardan meses?</h4>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li><strong>Latencia profunda:</strong> algunas semillas necesitan frío prolongado (estratificación) para romper la latencia. Por ejemplo, semillas de lavanda, rosemario o arbustos silvestres.</li>
                    <li><strong>Testa dura:</strong> la cubierta exterior impide la entrada de agua. La escarificación (lijar suavemente o remojar en agua caliente) acelera la germinación.</li>
                    <li><strong>Temperatura incorrecta:</strong> semillas de clima tropical (papaya, mango) no germinan por debajo de 20 °C. Las de clima frío (lechuga) fracasan por encima de 25 °C.</li>
                    <li><strong>Semillas viejas:</strong> la viabilidad decrece con el tiempo. Guárdalas en lugar fresco, seco y oscuro (nevera en bolsa sellada) para prolongar su vida útil.</li>
                    <li><strong>Inhibidores químicos:</strong> algunas semillas contienen sustancias que inhiben la germinación hasta que la lluvia las lava. Remojar en agua corriente 24 horas puede ayudar.</li>
                </ul>
            </div>

            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">En Lanzarote — Condiciones ideales</h4>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Temperatura interior: mantén los semilleros a 22-26 °C usando una esterilla calefactora</li>
                    <li>El viento Alisio seca los semilleros rápido: usa siempre cúpula o bolsa para retener humedad</li>
                    <li>La calima puede bajar la humedad relativa al 10-15%: protege los semilleros en interiores durante estos episodios</li>
                    <li>Usa agua sin cloro (deja reposar 24 horas o usa agua mineral) para mejorar la tasa de germinación</li>
                </ul>
            </div>
        </div>
    );
}

function PruningGuide() {
    return (
        <div className="space-y-5 text-sm text-foreground/80">

            <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">¿Por qué podar?</h4>
                <p>La poda redirige la energía de la planta desde el crecimiento vertical hacia el lateral o hacia los frutos. Con una poda correcta puedes controlar la forma, aumentar la cosecha y mejorar la ventilación para prevenir enfermedades.</p>
            </div>

            <div>
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">✂️ Técnicas principales</h4>
                <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-emerald-600 dark:text-emerald-400">Poda Apical (Topping)</h5>
                        <p className="text-muted-foreground mt-1">Se corta el brote principal por encima del 3.er o 4.º nudo. La planta responde creando <strong>dos nuevas colas dominantes</strong> en vez de una. Repitiendo varias veces se obtiene una planta muy ramificada.</p>
                        <div className="mt-2 text-xs bg-emerald-500/10 rounded p-2">
                            <strong>Ideal para:</strong> Cannabis fotoperiodico, tomate, pimiento, albahaca<br/>
                            <strong>Momento:</strong> Cuando la planta tiene 4-6 nudos bien formados<br/>
                            <strong>Recuperación:</strong> 5-7 días antes de retomar el crecimiento normal
                        </div>
                    </div>

                    <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-blue-600 dark:text-blue-400">FIM (F*ck I Missed)</h5>
                        <p className="text-muted-foreground mt-1">Corta solo el 75-80% del brote principal (sin eliminar la base). Produce <strong>3-4 ramas nuevas</strong> y hay menos estrés que con el topping clásico. Técnica menos precisa pero muy efectiva.</p>
                        <div className="mt-2 text-xs bg-blue-500/10 rounded p-2">
                            <strong>Ideal para:</strong> Cannabis fotoperiodico en vegetativo<br/>
                            <strong>Momento:</strong> Brote de 1-2 cm visible en el ápice<br/>
                            <strong>Ventaja:</strong> Menos tiempo de recuperación que el topping completo
                        </div>
                    </div>

                    <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-amber-600 dark:text-amber-400">LST — Low Stress Training</h5>
                        <p className="text-muted-foreground mt-1">Sin cortes: se doblan las ramas con hilo o alambre para crear una <strong>dosel plana</strong>. Todos los brotes reciben igual luz. Compatible con autoflorecientes.</p>
                        <div className="mt-2 text-xs bg-amber-500/10 rounded p-2">
                            <strong>Ideal para:</strong> Cannabis Auto y fotoperiodico, pepino, sandía, melón<br/>
                            <strong>Momento:</strong> Desde semana 2-3 durante todo el vegetativo<br/>
                            <strong>Ventaja:</strong> Sin estrés por corte, apta para autos
                        </div>
                    </div>

                    <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-red-500">Pinzado (Pinching)</h5>
                        <p className="text-muted-foreground mt-1">Se pellizca o corta el extremo del brote con los dedos. Más suave que el topping. Muy usado en hierbas aromáticas para mantenerlas compactas y productivas.</p>
                        <div className="mt-2 text-xs bg-red-500/10 rounded p-2">
                            <strong>Ideal para:</strong> Albahaca, menta, perejil, pimiento<br/>
                            <strong>Momento:</strong> Cuando el tallo tiene 15-20 cm o antes de florecer<br/>
                            <strong>Efecto:</strong> Ramificación lateral, follaje más denso
                        </div>
                    </div>

                    <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-orange-500">Defoliación selectiva</h5>
                        <p className="text-muted-foreground mt-1">Elimina las hojas grandes que dan sombra a los brotes inferiores. Mejora la penetración de luz y la ventilación. Elimina también hojas amarillas o enfermas.</p>
                        <div className="mt-2 text-xs bg-orange-500/10 rounded p-2">
                            <strong>Ideal para:</strong> Cannabis en floración, tomate, pimiento<br/>
                            <strong>Momento:</strong> Inicio de floración y a las 3 semanas de floración<br/>
                            <strong>Regla:</strong> Nunca elimines más del 30% del follaje a la vez
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3 text-foreground">🌿 Poda por planta</h4>
                <div className="space-y-2">
                    {[
                        {
                            plant: '🌿 Albahaca',
                            color: 'text-green-500',
                            text: 'Pinza los brotes florales en cuanto aparezcan. Corta por encima de un par de hojas. La planta se ramifica y dura meses más. Si florece, las hojas se vuelven pequeñas y amargas.'
                        },
                        {
                            plant: '🍅 Tomate',
                            color: 'text-red-500',
                            text: 'Elimina los "chupones" (brotes axilares entre tallo y rama) cuando tienen 5-7 cm. Deja 1-2 tallos principales. En Canarias, reduce también las hojas inferiores para evitar hongos del suelo.'
                        },
                        {
                            plant: '🌶️ Pimiento',
                            color: 'text-orange-500',
                            text: 'Elimina las primeras 2-3 flores para fortalecer la estructura. Deja 2-3 ramas principales en la "Y" inicial. Poda las ramas enfermas o cruzadas para mejorar la ventilación interior.'
                        },
                        {
                            plant: '🌸 Cannabis Fotoperiodico',
                            color: 'text-purple-500',
                            text: 'Topping en semana 3-4 de vegetativo (4-6 nudos). Combina con LST. Defoliación al inicio de floración. NUNCA podas en las 2 semanas previas al cambio de luz, ni durante la floración activa.'
                        },
                        {
                            plant: '🌿 Cannabis Auto',
                            color: 'text-blue-500',
                            text: 'Solo LST suave (sin cortes). Las autos no tienen tiempo de recuperarse de una poda agresiva. Dobla las ramas con hilo desde semana 2 para crear dosel plana y maximizar la luz.'
                        },
                        {
                            plant: '🥒 Pepino / Calabacín',
                            color: 'text-emerald-500',
                            text: 'Elimina los laterales por debajo del 3.er nudo para mejorar la aireación. En el pepino, guía un solo tallo vertical por la espaldera y poda a 2 hojas los laterales para mayor producción.'
                        },
                    ].map(({ plant, color, text }) => (
                        <div key={plant} className="border rounded-lg p-2.5">
                            <span className={`font-semibold text-xs ${color}`}>{plant}</span>
                            <p className="text-xs text-muted-foreground mt-1">{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DIYPotsGuide() {
    return (
        <div className="space-y-4 text-sm text-foreground/80">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">¿Por qué hacer macetas caseras?</h4>
                <p className="text-muted-foreground text-xs">Reutilizar materiales cotidianos reduce residuos y puede ahorrar mucho dinero. En Lanzarote muchos agricultores tradicionales usan bidones, neumáticos y saquillos para aprovechar el calor que retienen.</p>
            </div>

            <div className="space-y-3">
                {[
                    {
                        icon: '🪣',
                        title: 'Cubos y garrafas recicladas',
                        color: 'text-blue-500',
                        steps: [
                            'Usa cubos de 20-25L de pintura o alimentarios (busca el símbolo ♻️ y la numeración PET/HDPE)',
                            'Haz 6-8 agujeros de 1 cm en la base con una broca o tornillo caliente',
                            'Añade 3-4 cm de picón volcánico, gravilla o arcilla expandida como capa drenante',
                            'Rellena con mezcla de tierra: 60% sustrato universal + 30% picón + 10% perlita',
                            'Los cubos blancos reflejan el calor; los negros lo absorben — elige según la estación',
                        ],
                        note: '✅ Ideal para: tomates, pimientos, pepinos, calabacines, cannabis'
                    },
                    {
                        icon: '🛍️',
                        title: 'Bolsas de tela (Fabric Pots)',
                        color: 'text-purple-500',
                        steps: [
                            'Cose bolsas con lona de yute, fieltro grueso o geotextil no tejido comprado en cualquier vivero',
                            'El geotextil de 180-250 g/m² es el más duradero y permite excelente aireación de raíces',
                            'Las dimensiones más útiles: 30×30 cm (~15L), 40×40 cm (~30L), 50×50 cm (~50L)',
                            'No hace falta capa drenante: el tejido permite que el agua drene por todos lados',
                            'La "aireación de raíces" auto-poda las raíces en los bordes: mucho más sano que raíces enrolladas',
                        ],
                        note: '✅ Ideal para: cannabis, fresas, hierbas aromáticas, lechuga'
                    },
                    {
                        icon: '🪵',
                        title: 'Cajas de madera o palets',
                        color: 'text-amber-600',
                        steps: [
                            'Usa tablas de palet sin tratamiento químico (evita palets marcados "MB" — metil bromuro)',
                            'Clava 4 tablas formando un cuadrado. Mínimo 25 cm de profundidad para hortalizas',
                            'Forra el interior con geotextil o plástico perforado para retener la tierra',
                            'Añade patas (listones de 5-10 cm) para elevarla y facilitar el drenaje',
                            'Pinta el exterior con aceite de linaza crudo para proteger la madera del sol canario',
                        ],
                        note: '✅ Ideal para: hierbas en jardín vertical, fresas en altura, lechugas, cebollas'
                    },
                    {
                        icon: '🧴',
                        title: 'Botellas PET (mini-macetas)',
                        color: 'text-teal-500',
                        steps: [
                            'Corta botellas de 2-5 litros por la mitad (el fondo será la maceta)',
                            'Haz 3-4 agujeros en la base con una aguja caliente',
                            'El cuello de la botella invertido puede usarse como regadera-gotero: colócalo boca abajo en la maceta para riego lento',
                            'Perfectas para semilleros, esquejes y plantas pequeñas en ventana o balcón',
                            'Cúbrelas con pintura blanca exterior para evitar el calentamiento excesivo y el algas en las raíces',
                        ],
                        note: '✅ Ideal para: semilleros, esquejes, albahaca, perejil, menta en interior'
                    },
                    {
                        icon: '🌋',
                        title: 'El método canario tradicional (hoyos en picón)',
                        color: 'text-red-500',
                        steps: [
                            'En Lanzarote el método tradicional más usado NO usa maceta: se planta directamente en el suelo volcánico',
                            'Se hace un hoyo de 40-60 cm de profundidad y se rellena con tierra fértil mezclada con estiércol',
                            'El picón de alrededor actúa como mulch natural que retiene la humedad nocturna (el "roce")',
                            'Este sistema es ideal para frutales, papas y hortalizas de raíz profunda',
                            'Si no tienes terreno, imita este sistema en un bidón de 200L cortado por la mitad',
                        ],
                        note: '✅ Ideal para: papas, batatas, tomates, pimientos, arbustos y frutales'
                    },
                ].map(({ icon, title, color, steps, note }) => (
                    <div key={title} className="border rounded-lg p-3">
                        <h5 className={`font-semibold flex items-center gap-2 ${color} mb-2`}>
                            <span className="text-lg">{icon}</span> {title}
                        </h5>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                            {steps.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                        <p className="text-xs mt-2 text-emerald-600 dark:text-emerald-400 font-medium">{note}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Regla de oro del drenaje</h4>
                <p className="text-xs text-muted-foreground">Toda maceta casera necesita <strong>agujeros de drenaje</strong>. Sin salida para el agua, las raíces se pudren en días. En el clima cálido de Lanzarote el encharcamiento es la causa número 1 de muerte de plantas en maceta.</p>
            </div>
        </div>
    );
}

function CannabisLegalGuide() {
    return (
        <div className="space-y-4 text-sm text-foreground/80">
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">⚠️ AVISO LEGAL</p>
                <p className="text-xs text-muted-foreground">Esta información es orientativa y de carácter divulgativo. Las leyes cambian: consulta siempre a un abogado para tu situación concreta.</p>
            </div>

            <div className="rounded-lg bg-muted/50 border p-3 space-y-3">
                <h4 className="font-semibold text-foreground">Marco legal general en España</h4>
                <p className="text-muted-foreground">En España <strong>no existe ninguna ley que autorice el cultivo de cannabis</strong>, pero tampoco existe ninguna ley que lo penalice como delito cuando se realiza en un ámbito privado para autoconsumo exclusivo.</p>

                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✅</span>
                        <div>
                            <span className="font-medium">Lo que no es delito:</span>
                            <p className="text-muted-foreground text-xs">El consumo personal en espacios privados no está tipificado como delito en el Código Penal español. El cultivo para autoconsumo en domicilio privado sin venta ni distribución se encuadra en una zona gris legal donde los tribunales han absuelto en numerosas ocasiones.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">❌</span>
                        <div>
                            <span className="font-medium">Lo que sí puede ser delito:</span>
                            <p className="text-muted-foreground text-xs">El cultivo destinado a la venta o distribución constituye un delito contra la salud pública (art. 368 CP). El consumo en espacios públicos y la tenencia en la vía pública son infracciones administrativas sancionables con multa (art. 36.18 Ley Orgánica 4/2015 de Seguridad Ciudadana).</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">⚠️</span>
                        <div>
                            <span className="font-medium">Zona gris — autoconsumo en domicilio:</span>
                            <p className="text-muted-foreground text-xs">No existe un número legal de plantas. Los jueces evalúan caso por caso. La jurisprudencia ha considerado hasta 2-4 plantas como compatible con el autoconsumo en muchos casos, pero no es una regla fija. Un indicio de venta (balanza, bolsitas, grandes cantidades) convierte el asunto en delito.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-muted/50 border p-3">
                <h4 className="font-semibold text-foreground mb-2">Islas Canarias — ¿Hay diferencias?</h4>
                <p className="text-muted-foreground text-xs">La legislación es de ámbito nacional. Las Comunidades Autónomas no tienen competencias propias en la regulación del cannabis. Las Islas Canarias aplican la misma normativa que el resto de España. El clima excepcional de las islas hace que las plantas sean más productivas, lo que puede llamar más la atención.</p>
            </div>

            <div className="rounded-lg bg-muted/50 border p-3">
                <h4 className="font-semibold text-foreground mb-2">Asociaciones y Clubes de Cannabis</h4>
                <p className="text-muted-foreground text-xs">Los clubes privados de cannabis operan en un vacío legal en España. No están legalizados ni ilegalizados expresamente. El Tribunal Supremo ha oscilado en sus criterios. En Canarias existen clubes que operan bajo sus propios estatutos pero con riesgo legal inherente. Consulta la situación actual antes de asociarte.</p>
            </div>

            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Principios de seguridad personal</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Cultiva exclusivamente en espacios privados, no visibles desde la vía pública</li>
                    <li>No almacenes cantidades que vayan más allá del consumo personal razonable</li>
                    <li>No distribuyas ni vendas bajo ningún concepto</li>
                    <li>Mantén discreción: el olor puede ser motivo de denuncia por parte de vecinos</li>
                    <li>En caso de cualquier problema legal, ejerce tu derecho a permanecer en silencio y solicita abogado</li>
                </ul>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GrowingGuide() {
    const { genetics } = useSettings();
    const [openSection, setOpenSection] = useState<string | null>(null);

    const sections: Section[] = [
        {
            id: 'germination',
            title: 'Guía de Germinación',
            icon: '🌱',
            content: <GerminationGuide />,
        },
        {
            id: 'pruning',
            title: 'Técnicas de Poda',
            icon: '✂️',
            content: <PruningGuide />,
        },
        {
            id: 'diypots',
            title: 'Macetas Caseras y Recicladas',
            icon: '🪣',
            content: <DIYPotsGuide />,
        },
        ...(genetics === 'Auto' || genetics === 'Feminizada' ? [{
            id: 'legal',
            title: 'Marco Legal en España',
            icon: '⚖️',
            content: <CannabisLegalGuide />,
        }] : []),
    ];

    const toggleSection = (id: string) => {
        setOpenSection(prev => prev === id ? null : id);
    };

    return (
        <Card className="border-emerald-500/20">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Guías de Cultivo
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Germina semillas, aprende a podar y saca el máximo a tus plantas
                </p>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
                {sections.map(section => (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{section.icon}</span>
                                <span className="font-medium text-sm">{section.title}</span>
                            </div>
                            {openSection === section.id
                                ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                                : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            }
                        </button>
                        {openSection === section.id && (
                            <div className="px-3 pb-3 border-t bg-muted/20">
                                <div className="pt-3">
                                    {section.content}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
