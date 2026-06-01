import { getYearlyData, getDayOfYear } from '@/lib/solar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ReferenceLine, TooltipProps } from 'recharts';
import { useMemo } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Sun, Moon, Info, Sprout, AlertTriangle } from 'lucide-react';

export function DaylightChart() {
  const { genetics, sowDate, latitude, longitude } = useSettings();
  const year = new Date().getFullYear();
  const todayDOY = getDayOfYear(new Date());

  const data = useMemo(() => {
    const yearly = getYearlyData(year, latitude, longitude);

    // Average monthly precipitation and temperature for Lanzarote
    const monthlyPrec = [15, 15, 10, 5, 2, 0, 0, 0, 2, 10, 15, 20]; // % prob
    const monthlyTemp = [17, 18, 19, 20, 21, 23, 24, 25, 24, 23, 20, 18]; // °C

    return yearly.map(d => {
      const monthIdx = d.month;
      const prec = monthlyPrec[monthIdx];
      const temp = monthlyTemp[monthIdx];

      // Germination Success Calculation (Tomato)
      // Ideal: 20-25°C. Lower success outside this range.
      let germSuccess = 0;
      if (temp >= 20 && temp <= 25) germSuccess = 100 - (Math.abs(temp - 22.5) * 10);
      else if (temp < 20) germSuccess = Math.max(0, 100 - (20 - temp) * 15);
      else germSuccess = Math.max(0, 100 - (temp - 25) * 20);

      // Ideal Conditions Calculation (Tomato)
      // Ideal: 18-25°C + >12h light.
      let idealCond = Math.max(0, 100 - Math.abs(temp - 21.5) * 8);
      if (d.dayLength < 12) idealCond *= 0.7; // Penality for short days

      return {
        ...d,
        darknessLength: 24 - d.dayLength,
        precipitation: prec,
        germinationSuccess: Math.round(germSuccess),
        idealCondition: Math.round(idealCond)
      };
    });
  }, [year, latitude, longitude]);

  const isCannabis = genetics === "Auto" || genetics === "Feminizada";
  const isAuto = genetics === "Auto";

  // Reveg Alert Logic:
  // Trigger only for Cannabis profiles (Auto or Feminizada)
  const checkRevegRisk = (): boolean => {
    if (!isCannabis || isAuto || !sowDate) return false;
    const sowMonth = new Date(sowDate).getMonth() + 1; // 1-12
    const currentMonth = new Date().getMonth() + 1;

    const isWinterSown = sowMonth === 11 || sowMonth === 12 || sowMonth === 1 || sowMonth === 2;
    const isSpringNow = currentMonth >= 3 && currentMonth <= 5;

    return isWinterSown && isSpringNow;
  };
  const isRevegRisk = checkRevegRisk();

  const isSplitView = !isCannabis;

  const phases = useMemo(() => {
    if (!data || data.length === 0 || isAuto) return []; // Autos ignore natural phases

    const transitions: { date: string; label: string; color: string }[] = [];
    let currentPhase = '';

    const vegThreshold = 13.5;
    const flowerThreshold = 12.5;

    data.forEach((d, i) => {
      const lightHours = d.dayLength;
      const isLengthening = i < 182;
      let phase = '';

      if (lightHours >= vegThreshold && isLengthening) phase = 'vegetativo';
      else if (lightHours >= flowerThreshold) phase = 'prefloracion';
      else if (lightHours >= 11.0) phase = 'floracion';
      else if (lightHours >= 10.0 && !isLengthening) phase = 'maduracion';
      else phase = 'reposo';

      if (phase !== currentPhase && phase) {
        transitions.push({
          date: d.date,
          label:
            phase === 'vegetativo'
              ? 'Germinación'
              : phase === 'prefloracion'
                ? 'Pre-Floración'
                : phase === 'floracion'
                  ? 'Floración'
                  : phase === 'maduracion'
                    ? 'Maduración'
                    : 'Reposo',
          color:
            phase === 'vegetativo'
              ? 'hsl(120,60%,50%)'
              : phase === 'prefloracion'
                ? 'hsl(60,60%,50%)'
                : phase === 'floracion'
                  ? 'hsl(300,60%,50%)'
                  : phase === 'maduracion'
                    ? 'hsl(30,60%,50%)'
                    : 'hsl(200,60%,50%)'
        });
        currentPhase = phase;
      }
    });

    return transitions;
  }, [data, genetics, isAuto]);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur border border-border p-3 rounded-lg shadow-xl text-sm z-50">
          <p className="font-semibold mb-2">{d.fullDate}</p>
          <div className="space-y-1">
            <p className="text-yellow-500 flex items-center gap-2">
              <Sun className="h-3 w-3" /> {isSplitView ? 'Horas de Luz' : 'Luz'}: {d.dayLength.toFixed(1)}h
            </p>
            <p className="text-indigo-400 flex items-center gap-2">
              <Moon className="h-3 w-3" /> {isSplitView ? 'Horas de Noche' : 'Oscuridad'}: {d.darknessLength.toFixed(1)}h
            </p>
            {isSplitView && (
              <div className="mt-2 text-xs space-y-1 border-t pt-1 border-border">
                <p className="text-blue-400">💧 Prob. Lluvia: {d.precipitation}%</p>
                <p className="text-green-400">🌱 Éxito Germinación: {d.germinationSuccess}%</p>
                <p className="text-red-400">🍅 Cond. Ideales: {d.idealCondition}%</p>
              </div>
            )}
            {isAuto && (
              <p className="text-purple-400 mt-2 text-xs border-t pt-1 border-border bg-purple-500/10 p-1 rounded">
                Semilla Auto (Ciclo independiente)
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-500" />
          {isSplitView ? `Perfil de Cultivo: ${{
            Tomato: 'Tomate',
            Pepper: 'Pimiento',
            Aloe: 'Aloe Vera',
            Papaya: 'Papaya',
            Mango: 'Mango',
            Basil: 'Albahaca',
            Mint: 'Menta',
            Lavender: 'Lavanda',
            Auto: 'Cannabis (Autofloreciente)',
            Feminizada: 'Cannabis (Fotodependiente)'
          }[genetics as string] || genetics
            }` : `Fotoperiodo (${genetics})`}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alerts and Info Banners based on Genetics */}
        {isAuto && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-md text-sm text-purple-600 dark:text-purple-400 flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Las genéticas autoflorecientes no dependen de las horas de luz para florecer. Crecerán y florarán según sus días de vida, ignorando la curva que ves abajo.
            </p>
          </div>
        )}

        {isRevegRisk && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="block mb-1">Peligro Crítico de Revegetación</strong>
              <p>
                Germinaste en Invierno ({new Date(sowDate!).toLocaleDateString('es-ES', { month: 'long' })})
                y ahora las horas de luz en Canarias están aumentando muy rápido.
                La planta puede estresarse, detener la floración y sacar hojas deformes.
              </p>
            </div>
          </div>
        )}

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="dayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#fcd34d" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="darkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={30} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="time" domain={[0, 24]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" hide={!isSplitView} />
              <YAxis yAxisId="percent" domain={[0, 100]} orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" hide={!isSplitView} />
              {!isSplitView && <YAxis domain={[9, 15]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />}

              <Tooltip content={<CustomTooltip />} />

              {isSplitView ? (
                <>
                  <Line yAxisId="time" type="monotone" dataKey="dayLength" stroke="#f59e0b" name="Horas de Luz" strokeWidth={2} dot={false} />
                  <Line yAxisId="time" type="monotone" dataKey="darknessLength" stroke="#3b82f6" name="Horas de Noche" strokeWidth={2} dot={false} />
                  <Area yAxisId="percent" type="monotone" dataKey="precipitation" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.1} name="Prob. Precipitaciones" strokeWidth={1} dot={false} />
                  <Line yAxisId="percent" type="monotone" dataKey="germinationSuccess" stroke="#10b981" name="Éxito Germinación" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                  <Line yAxisId="percent" type="monotone" dataKey="idealCondition" stroke="#ef4444" name="Condiciones Ideales" strokeWidth={3} dot={false} />
                </>
              ) : (
                <>
                  <Area type="monotone" dataKey="dayLength" stroke="#f59e0b" fill="url(#dayGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="darknessLength" stroke="#3b82f6" fill="url(#darkGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="dayLength" stroke="#d97706" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="darknessLength" stroke="#2563eb" strokeWidth={3} dot={false} />
                </>
              )}

              <ReferenceLine
                yAxisId={isSplitView ? "time" : undefined}
                x={data[todayDOY - 1]?.date}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{ value: 'Hoy', fontSize: 10, fill: '#10b981' }}
              />

              {phases.map((phase, i) => (
                <ReferenceLine
                  yAxisId={isSplitView ? "time" : undefined}
                  key={i}
                  x={phase.date}
                  stroke={phase.color}
                  strokeDasharray="2 2"
                  label={{
                    value: phase.label,
                    fontSize: 8,
                    fill: phase.color,
                    angle: -90,
                    position: 'top'
                  }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda de fases */}
        {genetics !== "Auto" && !isSplitView && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            {/* ... existents ... */}
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border">
              <div className="font-semibold text-green-600">Vegetativo</div>
              <p>Días largos &gt;13h. Crecimiento sin flores.</p>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border">
              <div className="font-semibold text-yellow-600">Transición</div>
              <p>Noches &gt;11h activan estirón y pre-flores.</p>
            </div>
            <div className="p-2 bg-pink-50 dark:bg-pink-950/20 rounded border">
              <div className="font-semibold text-pink-600">Producción</div>
              <p>Floración activa. Noches ininterrumpidas.</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded border">
              <div className="font-semibold text-amber-600">Maduración</div>
              <p>Tricomas maduran. Preparar machete.</p>
            </div>
          </div>
        )}

        {isSplitView && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border">
              <div className="font-semibold text-blue-600">Precipitaciones</div>
              <p>Probabilidad de lluvia (%) según clima histórico.</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border">
              <div className="font-semibold text-green-600">Éxito Germinación</div>
              <p>Viabilidad de siembra basada en temperatura.</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded border">
              <div className="font-semibold text-red-600">Condiciones Ideales</div>
              <p>Ajuste de luz y temperatura para Tomate.</p>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded border">
              <div className="font-semibold text-orange-600">Fotoperiodo Diurno</div>
              <p>Horas de luz directa necesarias (12h+).</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}