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

// Find the hourly index that best matches the current local hour in the given timezone.
function getCurrentHourIndex(times: string[], timezone = 'UTC'): number {
  const nowUtc = new Date();
  // Build a string like "2026-06-21T13" in local timezone to match against hourly entries
  const localHourStr = nowUtc.toLocaleString('sv-SE', { timeZone: timezone, hour12: false })
    .slice(0, 13).replace(' ', 'T'); // "2026-06-21T13"
  const idx = times.findIndex(t => t.startsWith(localHourStr));
  return idx >= 0 ? idx : 0;
}

// Detect calima (Saharan dust): very dry + warm + wind typically from SE/S
function isCalimaCondition(temp: number, humidity: number): boolean {
  return temp > 28 && humidity < 25;
}

export function evaluateAlertRules(
  weather: AlertRuleInput,
  thresholds: AlertThresholds = DEFAULT_ALERT_THRESHOLDS,
): AlertRuleResult[] {
  const alerts: AlertRuleResult[] = [];
  const { current, daily, hourly, timezone } = weather;

  // ---- Current-moment alerts ------------------------------------------------

  if (current.temperature < thresholds.minTemp) {
    alerts.push({
      type: 'frost',
      severity: 'danger',
      message: `¡Temperatura peligrosamente baja ahora mismo! ${current.temperature}°C (umbral: ${thresholds.minTemp}°C).`,
      icon: '🥶',
    });
  }

  if (current.temperature > thresholds.maxTemp) {
    alerts.push({
      type: 'heat',
      severity: 'danger',
      message: `Calor extremo en este momento: ${current.temperature}°C (umbral: ${thresholds.maxTemp}°C). Protege las plantas.`,
      icon: '🔥',
    });
  }

  if (current.uvIndex > thresholds.uv) {
    alerts.push({
      type: 'uv',
      severity: 'danger',
      message: `Radiación UV extrema: índice ${current.uvIndex} (umbral: ${thresholds.uv}). Riesgo de quemaduras foliares.`,
      icon: '⚡',
    });
  } else if (current.uvIndex >= thresholds.uv * 0.8) {
    alerts.push({
      type: 'uv',
      severity: 'warning',
      message: `UV elevado: índice ${current.uvIndex}. Considera malla de sombreo del 30 % para plantas sensibles.`,
      icon: '☀️',
    });
  }

  if (current.windSpeed > thresholds.wind) {
    alerts.push({
      type: 'wind',
      severity: 'danger',
      message: `Viento sostenido muy fuerte: ${current.windSpeed} km/h (umbral: ${thresholds.wind} km/h). Asegura tutores y mallas.`,
      icon: '🌬️',
    });
  } else if (current.windSpeed > thresholds.wind * 0.75) {
    alerts.push({
      type: 'wind',
      severity: 'warning',
      message: `Viento fuerte: ${current.windSpeed} km/h. Revisa el estado de mallas y tutores.`,
      icon: '💨',
    });
  }

  if (current.windGust > thresholds.wind * 1.2) {
    alerts.push({
      type: 'windGust',
      severity: 'danger',
      message: `Rachas peligrosas ahora: ${current.windGust} km/h. Riesgo de rotura de ramas en floración.`,
      icon: '🌪️',
    });
  }

  // ---- Next 24 hours from NOW (not from midnight) ---------------------------

  const startIdx = getCurrentHourIndex(hourly.time, timezone);
  const endIdx = Math.min(startIdx + 24, hourly.time.length);

  const next24h = {
    temp: hourly.temperature.slice(startIdx, endIdx),
    humidity: hourly.humidity.slice(startIdx, endIdx),
    dewPoint: hourly.dewPoint.slice(startIdx, endIdx),
    wind: hourly.windSpeed.slice(startIdx, endIdx),
    gust: hourly.windGust.slice(startIdx, endIdx),
    pop: hourly.precipitationProbability.slice(startIdx, endIdx),
    time: hourly.time.slice(startIdx, endIdx),
  };

  if (next24h.temp.length === 0) return alerts;

  // Cold forecast
  const minForecast = Math.min(...next24h.temp);
  if (minForecast < thresholds.minTemp) {
    const minIndex = next24h.temp.indexOf(minForecast);
    alerts.push({
      type: 'frost',
      severity: 'warning',
      message: `Frío previsto: ${minForecast}°C a las ${fmtHour(next24h.time[minIndex], timezone)} (próximas 24 h).`,
      icon: '❄️',
    });
  }

  // Heat forecast (warn at -3°C below danger threshold)
  const maxForecast = Math.max(...next24h.temp);
  if (maxForecast > thresholds.maxTemp - 3) {
    const maxIndex = next24h.temp.indexOf(maxForecast);
    alerts.push({
      type: 'heat',
      severity: maxForecast > thresholds.maxTemp ? 'danger' : 'warning',
      message: `Calor previsto: ${maxForecast}°C a las ${fmtHour(next24h.time[maxIndex], timezone)}. Prepara sombreo y riego extra.`,
      icon: '☀️',
    });
  }

  // Wind gust forecast
  const maxGust = Math.max(...next24h.gust);
  if (maxGust > thresholds.wind * 0.85) {
    const maxGustIndex = next24h.gust.indexOf(maxGust);
    alerts.push({
      type: 'windGust',
      severity: maxGust > thresholds.wind ? 'danger' : 'warning',
      message: `Rachas previstas: ${maxGust} km/h a las ${fmtHour(next24h.time[maxGustIndex], timezone)}.`,
      icon: '💨',
    });
  }

  // Dew point / condensation risk (difference ≤ 2°C → near saturation)
  for (let i = 0; i < next24h.temp.length; i++) {
    const diff = next24h.temp[i] - next24h.dewPoint[i];
    if (diff <= 2) {
      alerts.push({
        type: 'dewPoint',
        severity: diff <= 0.5 ? 'danger' : 'warning',
        message: `Riesgo de condensación a las ${fmtHour(next24h.time[i], timezone)}: ${next24h.temp[i]}°C / ${next24h.humidity[i]}% HR. Ventila para prevenir hongos.`,
        icon: '💧',
      });
      break;
    }
  }

  // High humidity at night (Botrytis risk)
  const nightHours = next24h.humidity.filter((_, i) => {
    const h = new Date(next24h.time[i]).getUTCHours();
    return h >= 20 || h <= 6;
  });
  const maxNightHumidity = nightHours.length > 0 ? Math.max(...nightHours) : 0;
  if (maxNightHumidity > 80) {
    alerts.push({
      type: 'dewPoint',
      severity: maxNightHumidity > 90 ? 'danger' : 'warning',
      message: `Humedad nocturna alta: hasta ${maxNightHumidity}% esta noche. Riesgo de moho y Botrytis en plantas densas.`,
      icon: '🌫️',
    });
  }

  // Calima (Saharan dust) detection
  const calimaHours = next24h.temp.filter((t, i) => isCalimaCondition(t, next24h.humidity[i]));
  if (calimaHours.length >= 3) {
    alerts.push({
      type: 'heat',
      severity: 'warning',
      message: `Posible episodio de calima: temperaturas altas con humedad <25%. Aumenta el riego y protege esquejes. El polvo puede obstruir estomas foliares.`,
      icon: '🌫️',
    });
  }

  // Precipitation
  const rainToday = daily.precipitationSum[0] ?? 0;
  const rainTomorrow = daily.precipitationSum[1] ?? 0;
  const maxPop = Math.max(...next24h.pop);
  if (rainToday > thresholds.rain) {
    alerts.push({
      type: 'precipitation',
      severity: rainToday > thresholds.rain * 2 ? 'danger' : 'warning',
      message: `Lluvia significativa: ${rainToday}mm hoy${rainTomorrow > 5 ? ` + ${rainTomorrow}mm mañana` : ''}. Revisa el drenaje del sustrato.`,
      icon: '🌧️',
    });
  } else if (maxPop > 75) {
    alerts.push({
      type: 'precipitation',
      severity: 'warning',
      message: `Alta probabilidad de lluvia: ${maxPop}% en las próximas 24 h. Reduce el riego programado.`,
      icon: '🌦️',
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
