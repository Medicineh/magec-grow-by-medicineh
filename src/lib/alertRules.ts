export type AlertSeverity = 'warning' | 'danger';
export type GlobalAlertStatus = 'normal' | 'warning' | 'danger';

export type AlertType =
  | 'frost'
  | 'heat'
  | 'uv'
  | 'wind'
  | 'windGust'
  | 'precipitation'
  | 'dewPoint';

export interface AlertThresholds {
  wind: number;
  maxTemp: number;
  minTemp: number;
  uv: number;
  rain: number;
}

export interface AlertRuleInput {
  current: {
    temperature: number;
    uvIndex: number;
    windSpeed: number;
    windGust: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    dewPoint: number[];
    windSpeed: number[];
    windGust: number[];
    precipitationProbability: number[];
  };
  daily: {
    precipitationSum: number[];
  };
  timezone?: string;
}

export interface AlertRuleResult {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  icon: string;
}

const STATUS_WEIGHT: Record<GlobalAlertStatus, number> = {
  normal: 0,
  warning: 1,
  danger: 2,
};

export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  wind: 60,
  maxTemp: 37,
  minTemp: 5,
  uv: 10,
  rain: 15,
};

function fmtHour(dateLike: string, timezone = 'UTC') {
  return new Date(dateLike).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  });
}

export function evaluateAlertRules(
  weather: AlertRuleInput,
  thresholds: AlertThresholds = DEFAULT_ALERT_THRESHOLDS,
): AlertRuleResult[] {
  const alerts: AlertRuleResult[] = [];
  const { current, daily, hourly, timezone } = weather;

  if (current.temperature < thresholds.minTemp) {
    alerts.push({
      type: 'frost',
      severity: 'danger',
      message: `¡Temp. baja inmediata! ${current.temperature}°C (Umbral: <${thresholds.minTemp}°C).`,
      icon: '🥶',
    });
  }

  if (current.temperature > thresholds.maxTemp) {
    alerts.push({
      type: 'heat',
      severity: 'danger',
      message: `Calor extremo ahora: ${current.temperature}°C (Umbral: >${thresholds.maxTemp}°C).`,
      icon: '🔥',
    });
  }

  if (current.uvIndex > thresholds.uv) {
    alerts.push({
      type: 'uv',
      severity: 'danger',
      message: `UV extremo: ${current.uvIndex} (Umbral: >${thresholds.uv}).`,
      icon: '⚡',
    });
  }

  if (current.windSpeed > thresholds.wind) {
    alerts.push({
      type: 'wind',
      severity: 'danger',
      message: `Viento sostenido muy fuerte: ${current.windSpeed} km/h (Umbral: >${thresholds.wind} km/h).`,
      icon: '🌬️',
    });
  }

  if (current.windGust > thresholds.wind) {
    alerts.push({
      type: 'windGust',
      severity: 'danger',
      message: `Rachas peligrosas: ${current.windGust} km/h (Umbral: >${thresholds.wind} km/h).`,
      icon: '🌪️',
    });
  }

  const next24h = {
    temp: hourly.temperature.slice(0, 24),
    humidity: hourly.humidity.slice(0, 24),
    dewPoint: hourly.dewPoint.slice(0, 24),
    wind: hourly.windSpeed.slice(0, 24),
    gust: hourly.windGust.slice(0, 24),
    pop: hourly.precipitationProbability.slice(0, 24),
    time: hourly.time.slice(0, 24),
  };

  const minForecast = Math.min(...next24h.temp);
  if (minForecast < thresholds.minTemp) {
    const minIndex = next24h.temp.indexOf(minForecast);
    alerts.push({
      type: 'frost',
      severity: 'warning',
      message: `Riesgo de frío: ${minForecast}°C a las ${fmtHour(next24h.time[minIndex], timezone)}.`,
      icon: '❄️',
    });
  }

  const maxForecast = Math.max(...next24h.temp);
  if (maxForecast > thresholds.maxTemp - 5) {
    const maxIndex = next24h.temp.indexOf(maxForecast);
    alerts.push({
      type: 'heat',
      severity: 'warning',
      message: `Calor previsto: ${maxForecast}°C a las ${fmtHour(next24h.time[maxIndex], timezone)}.`,
      icon: '☀️',
    });
  }

  const maxGust = Math.max(...next24h.gust);
  if (maxGust > thresholds.wind * 0.9) {
    const maxGustIndex = next24h.gust.indexOf(maxGust);
    alerts.push({
      type: 'windGust',
      severity: 'warning',
      message: `Rachas previstas: ${maxGust} km/h a las ${fmtHour(next24h.time[maxGustIndex], timezone)}.`,
      icon: '💨',
    });
  }

  for (let i = 0; i < next24h.temp.length; i++) {
    const diff = next24h.temp[i] - next24h.dewPoint[i];
    if (diff <= 1) {
      alerts.push({
        type: 'dewPoint',
        severity: 'warning',
        message: `Riesgo de condensación a las ${fmtHour(next24h.time[i], timezone)}: ${next24h.temp[i]}°C y ${next24h.humidity[i]}% humedad.`,
        icon: '💧',
      });
      break;
    }
  }

  const rainToday = daily.precipitationSum[0] ?? 0;
  const maxPop = Math.max(...next24h.pop);
  if (rainToday > thresholds.rain || maxPop > 70) {
    alerts.push({
      type: 'precipitation',
      severity: rainToday > thresholds.rain * 1.5 ? 'danger' : 'warning',
      message: `Lluvia prevista hoy: ${rainToday}mm (prob. máx ${maxPop}%).`,
      icon: '🌧️',
    });
  }

  return alerts;
}

export function deriveGlobalStatus(alerts: AlertRuleResult[]): GlobalAlertStatus {
  if (alerts.some((a) => a.severity === 'danger')) return 'danger';
  if (alerts.some((a) => a.severity === 'warning')) return 'warning';
  return 'normal';
}

export function isGlobalStatusEscalation(
  previousStatus: GlobalAlertStatus | null | undefined,
  currentStatus: GlobalAlertStatus,
): boolean {
  const previousWeight = STATUS_WEIGHT[previousStatus ?? 'normal'];
  return STATUS_WEIGHT[currentStatus] > previousWeight;
}

export function deriveAlertSnapshot(
  alerts: AlertRuleResult[],
): Partial<Record<AlertType, AlertSeverity>> {
  return alerts.reduce<Partial<Record<AlertType, AlertSeverity>>>((snapshot, alert) => {
    const current = snapshot[alert.type];
    if (!current || STATUS_WEIGHT[alert.severity] > STATUS_WEIGHT[current]) {
      snapshot[alert.type] = alert.severity;
    }
    return snapshot;
  }, {});
}

/** Returns alert types that are newly present or whose severity increased. */
export function findAddedOrEscalatedAlertTypes(
  previousSnapshot: Partial<Record<AlertType, AlertSeverity>> | null | undefined,
  currentSnapshot: Partial<Record<AlertType, AlertSeverity>>,
): AlertType[] {
  return (Object.keys(currentSnapshot) as AlertType[]).filter((type) => {
    const currentSeverity = currentSnapshot[type]!;
    const previousSeverity = previousSnapshot?.[type];
    return !previousSeverity || STATUS_WEIGHT[currentSeverity] > STATUS_WEIGHT[previousSeverity];
  });
}
