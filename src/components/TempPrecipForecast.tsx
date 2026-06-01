import { DailyData } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from 'recharts';

type RangeValue = [number, number];

const isRangeValue = (value: unknown): value is RangeValue => (
    Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'number'
    && typeof value[1] === 'number'
);

interface Props {
    daily: DailyData;
}

export function TempPrecipForecast({ daily }: Props) {
    const data = daily.time.map((day, i) => {
        const date = new Date(day);
        const dayName = i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short' });
        return {
            name: dayName,
            tempMax: daily.temperatureMax[i],
            tempMin: daily.temperatureMin[i],
            tempRange: [daily.temperatureMin[i], daily.temperatureMax[i]],
            appTempMax: daily.apparentTemperatureMax[i],
            appTempMin: daily.apparentTemperatureMin[i],
            appTempRange: [daily.apparentTemperatureMin[i], daily.apparentTemperatureMax[i]],
            precipProb: daily.precipitationProbabilityMax[i],
        };
    });

    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">🌡️ Pronóstico de Temperatura y Precipitación 7 Días</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-[250px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />

                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11 }}
                                stroke="hsl(var(--muted-foreground))"
                            />

                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 100]}
                                tickFormatter={(val) => `${val}%`}
                                tick={{ fontSize: 11 }}
                                stroke="hsl(var(--primary))"
                            />

                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 11 }}
                                stroke="hsl(var(--muted-foreground))"
                                domain={['auto', 'auto']}
                                tickFormatter={(val) => `${val}°`}
                            />

                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
                                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                formatter={(value: number | RangeValue, name: string) => {
                                    if (name === 'Prob. Precip.') return [`${value}%`, name];
                                    if ((name === 'Temp. Rango' || name === 'Sens. Rango') && isRangeValue(value)) {
                                        return [`${value[0]}°C - ${value[1]}°C`, name === 'Temp. Rango' ? 'Temperatura' : 'Sensación'];
                                    }
                                    return [`${value}°C`, name];
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />

                            {/* Rain Probability Bar */}
                            <Bar
                                yAxisId="right"
                                dataKey="precipProb"
                                name="Prob. Precip."
                                fill="hsl(var(--primary))"
                                fillOpacity={0.3}
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />

                            {/* Apparent Temperature Area */}
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="appTempRange"
                                name="Sens. Rango"
                                stroke="none"
                                fill="hsl(var(--destructive))"
                                fillOpacity={0.15}
                            />

                            {/* Real Temperature Area */}
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="tempRange"
                                name="Temp. Rango"
                                stroke="none"
                                fill="hsl(var(--secondary))"
                                fillOpacity={0.3}
                            />

                            {/* Real Max/Min Lines (Optional for clearer boundaries) */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="tempMax"
                                name="Temp. Máx"
                                stroke="hsl(var(--secondary))"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="appTempMax"
                                name="Sensación Máx"
                                stroke="hsl(var(--destructive))"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={{ r: 3 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
