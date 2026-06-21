import { useWeather } from './useWeather';
import { useSettings } from '../context/SettingsContext';
import { getGrowingAlerts, GrowingAlert } from '../lib/weather';
import { getBotanyLogic, PlantPhaseInfo } from '../lib/botany';
import { getDayOfYear, getYearlyData } from '../lib/solar';
import { calculateET0, ET0Result } from '../lib/evapotranspiration';
import { useMemo } from 'react';

export interface UnifiedAdvice {
    alerts: GrowingAlert[];
    botany: PlantPhaseInfo;
    irrigation: ET0Result;
    priorityAlert: GrowingAlert | null;
}

export function useAdviceSystem(): { advice: UnifiedAdvice | null; isLoading: boolean } {
    const { data: weather, isLoading } = useWeather();
    const { genetics, sowDate, latitude, longitude } = useSettings();

    const advice = useMemo(() => {
        if (!weather) return null;

        const today = new Date();
        const dayOfYear = getDayOfYear(today);
        const yearlySolar = getYearlyData(today.getFullYear(), latitude, longitude);
        const lightHours = yearlySolar[dayOfYear - 1]?.dayLength || 12;

        // 1. Weather Alerts
        const alerts = getGrowingAlerts(weather);
        const severityWeight = (s: string) => s === 'danger' ? 1 : 0;
        const priorityAlert = alerts.length > 0
            ? [...alerts].sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity))[0]
            : null;

        // 2. Botany Logic
        const { phase } = getBotanyLogic(genetics, sowDate, dayOfYear, lightHours);

        // 3. Irrigation logic
        const irrigation = calculateET0(
            {
                tempMax: weather.daily.temperatureMax[0],
                tempMin: weather.daily.temperatureMin[0],
                tempMean: weather.current.temperature,
                humidity: weather.current.humidity,
                windSpeed: weather.current.windSpeed / 3.6,
            },
            dayOfYear,
            latitude
        );

        return {
            alerts,
            botany: phase,
            irrigation,
            priorityAlert
        };
    }, [weather, genetics, sowDate, latitude, longitude]);

    return { advice, isLoading };
}
