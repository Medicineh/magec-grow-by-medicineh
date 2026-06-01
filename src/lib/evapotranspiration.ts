/**
 * Cálculo de Evapotranspiración de Referencia (ET0) usando la ecuación de Penman-Monteith FAO-56
 * Adaptado para Lanzarote, Islas Canarias
 */

// Constantes de referencia default para Lanzarote
const DEFAULT_LATITUDE = 29.0469;
const DEFAULT_ALTITUDE = 100;

interface WeatherData {
  tempMax: number;      // °C
  tempMin: number;      // °C
  tempMean: number;     // °C
  humidity: number;     // % (humedad relativa)
  windSpeed: number;    // m/s a 2m de altura
  solarRadiation?: number; // MJ/m²/día (opcional, se calcula si no está disponible)
}

export interface ET0Result {
  et0: number;                    // mm/día
  waterNeedLiters: number;        // litros/m² (equivalente a mm)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  factors: {
    temperature: number;
    humidity: number;
    wind: number;
    radiation: number;
  };
}

/**
 * Calcula la presión de vapor de saturación (es) en kPa
 */
function saturationVaporPressure(temp: number): number {
  return 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
}

/**
 * Calcula la pendiente de la curva de presión de vapor (Δ) en kPa/°C
 */
function slopeVaporPressureCurve(temp: number): number {
  const es = saturationVaporPressure(temp);
  return (4098 * es) / Math.pow(temp + 237.3, 2);
}

/**
 * Calcula la presión atmosférica en kPa basada en altitud
 */
function atmosphericPressure(altitude: number): number {
  return 101.3 * Math.pow((293 - 0.0065 * altitude) / 293, 5.26);
}

/**
 * Calcula la constante psicrométrica (γ) en kPa/°C
 */
function psychrometricConstant(pressure: number): number {
  return 0.000665 * pressure;
}

/**
 * Calcula la radiación extraterrestre (Ra) en MJ/m²/día
 */
function extraterrestrialRadiation(dayOfYear: number, latitude: number): number {
  const latRad = (Math.PI / 180) * latitude;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI / 365) * dayOfYear);
  const delta = 0.409 * Math.sin((2 * Math.PI / 365) * dayOfYear - 1.39);
  const ws = Math.acos(-Math.tan(latRad) * Math.tan(delta));

  const Gsc = 0.0820; // Constante solar (MJ/m²/min)

  return (24 * 60 / Math.PI) * Gsc * dr * (
    ws * Math.sin(latRad) * Math.sin(delta) +
    Math.cos(latRad) * Math.cos(delta) * Math.sin(ws)
  );
}

/**
 * Estima la radiación solar (Rs) si no está disponible
 */
function estimateSolarRadiation(Ra: number, tempMax: number, tempMin: number): number {
  // Método Hargreaves
  const krs = 0.17; // Coeficiente para zonas costeras (como Canarias)
  return krs * Math.sqrt(tempMax - tempMin) * Ra;
}

/**
 * Calcula la radiación neta (Rn) en MJ/m²/día
 */
function netRadiation(
  Rs: number,
  Ra: number,
  tempMax: number,
  tempMin: number,
  ea: number,
  altitude: number = DEFAULT_ALTITUDE
): number {
  const albedo = 0.23; // Para cultivos de referencia
  const Rns = (1 - albedo) * Rs;

  const Rso = (0.75 + 2e-5 * altitude) * Ra;
  const ratio = Rs / Math.max(Rso, 0.1);

  const sigma = 4.903e-9; // Constante Stefan-Boltzmann (MJ/K⁴/m²/día)
  const TmaxK4 = Math.pow(tempMax + 273.16, 4);
  const TminK4 = Math.pow(tempMin + 273.16, 4);

  const Rnl = sigma * ((TmaxK4 + TminK4) / 2) *
    (0.34 - 0.14 * Math.sqrt(ea)) *
    (1.35 * Math.min(ratio, 1) - 0.35);

  return Rns - Rnl;
}

/**
 * Calcula ET0 usando la ecuación de Penman-Monteith FAO-56
 */
export function calculateET0(
  weather: WeatherData,
  dayOfYear: number,
  latitude: number = DEFAULT_LATITUDE,
  altitude: number = DEFAULT_ALTITUDE
): ET0Result {
  // Parámetros básicos
  const P = atmosphericPressure(altitude);
  const gamma = psychrometricConstant(P);
  const delta = slopeVaporPressureCurve(weather.tempMean);

  // Presiones de vapor
  const esMax = saturationVaporPressure(weather.tempMax);
  const esMin = saturationVaporPressure(weather.tempMin);
  const es = (esMax + esMin) / 2;
  const ea = es * (weather.humidity / 100);
  const vpd = es - ea; // Déficit de presión de vapor

  // Radiación
  const Ra = extraterrestrialRadiation(dayOfYear, latitude);
  const Rs = weather.solarRadiation ?? estimateSolarRadiation(Ra, weather.tempMax, weather.tempMin);
  const Rn = netRadiation(Rs, Ra, weather.tempMax, weather.tempMin, ea, altitude);

  // Flujo de calor del suelo (G) - asumimos G ≈ 0 para cálculos diarios
  const G = 0;

  // Velocidad del viento a 2m
  const u2 = weather.windSpeed;

  // Ecuación de Penman-Monteith FAO-56
  const numerator1 = 0.408 * delta * (Rn - G);
  const numerator2 = gamma * (900 / (weather.tempMean + 273)) * u2 * vpd;
  const denominator = delta + gamma * (1 + 0.34 * u2);

  const et0 = Math.max(0, (numerator1 + numerator2) / denominator);

  // Determinar nivel de riesgo y recomendación
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  let recommendation: string;

  if (et0 < 3) {
    riskLevel = 'low';
    recommendation = 'Demanda hídrica baja. Riego ligero o ninguno según humedad del suelo.';
  } else if (et0 < 5) {
    riskLevel = 'medium';
    recommendation = 'Demanda moderada. Regar en horas frescas (mañana temprano o atardecer).';
  } else if (et0 < 7) {
    riskLevel = 'high';
    recommendation = 'Alta evapotranspiración. Riego profundo necesario. Considerar mulching.';
  } else {
    riskLevel = 'critical';
    recommendation = 'Estrés hídrico crítico. Riego urgente. Proteger plantas del sol directo.';
  }

  return {
    et0: Math.round(et0 * 100) / 100,
    waterNeedLiters: Math.round(et0 * 100) / 100, // 1mm = 1 L/m²
    riskLevel,
    recommendation,
    factors: {
      temperature: Math.round(((weather.tempMean - 15) / 25) * 100) / 100, // Factor normalizado
      humidity: Math.round((1 - weather.humidity / 100) * 100) / 100,
      wind: Math.round(Math.min(u2 / 5, 1) * 100) / 100,
      radiation: Math.round(Math.min(Rs / 25, 1) * 100) / 100,
    },
  };
}

/**
 * Calcula el índice de estrés hídrico basado en condiciones actuales
 */
export function calculateWaterStressIndex(
  et0: number,
  soilMoisture: number,
  temperature: number,
  cropCoefficient: number = 1.0
): {
  index: number;
  status: 'óptimo' | 'leve' | 'moderado' | 'severo' | 'crítico';
  action: string;
} {
  // ETc = ET0 * Kc (necesidad real del cultivo)
  const etc = et0 * cropCoefficient;

  // Factor de estrés por humedad del suelo
  const moistureFactor = soilMoisture > 60 ? 0 :
    soilMoisture > 40 ? (60 - soilMoisture) / 20 :
      soilMoisture > 20 ? 0.5 + (40 - soilMoisture) / 40 :
        1;

  // Factor de estrés por temperatura
  const tempFactor = temperature > 35 ? (temperature - 35) / 10 :
    temperature < 10 ? (10 - temperature) / 10 :
      0;

  // Índice combinado (0-100)
  const index = Math.min(100, Math.round(
    (moistureFactor * 60) + // Humedad es el factor principal
    (tempFactor * 20) +
    (etc / 10 * 20)          // ET0 alta añade estrés
  ));

  let status: 'óptimo' | 'leve' | 'moderado' | 'severo' | 'crítico';
  let action: string;

  if (index < 20) {
    status = 'óptimo';
    action = 'Condiciones ideales. Mantener programa de riego actual.';
  } else if (index < 40) {
    status = 'leve';
    action = 'Estrés menor. Verificar humedad del suelo en próximas horas.';
  } else if (index < 60) {
    status = 'moderado';
    action = 'Regar pronto. Aumentar frecuencia o duración del riego.';
  } else if (index < 80) {
    status = 'severo';
    action = 'Riego urgente necesario. Las plantas pueden mostrar marchitez.';
  } else {
    status = 'crítico';
    action = 'Emergencia hídrica. Regar inmediatamente y proporcionar sombra.';
  }

  return { index, status, action };
}

/**
 * Determina si se debe activar el riego automático
 */
export function shouldTriggerIrrigation(
  et0: number,
  soilMoisture: number,
  temperature: number,
  config: {
    soilMoistureMin: number;
    soilMoistureCritical: number;
    tempMax: number;
    et0Threshold: number;
    cropCoefficient: number;
  }
): {
  shouldIrrigate: boolean;
  reason: string;
  urgency: 'normal' | 'alta' | 'urgente';
  duration: number; // minutos sugeridos
} {
  const stressInfo = calculateWaterStressIndex(
    et0, soilMoisture, temperature, config.cropCoefficient
  );

  // Prioridad 1: Humedad crítica
  if (soilMoisture < config.soilMoistureCritical) {
    return {
      shouldIrrigate: true,
      reason: `Humedad del suelo crítica (${soilMoisture}% < ${config.soilMoistureCritical}%)`,
      urgency: 'urgente',
      duration: 30,
    };
  }

  // Prioridad 2: Alta temperatura con humedad baja
  if (temperature > config.tempMax && soilMoisture < config.soilMoistureMin + 10) {
    return {
      shouldIrrigate: true,
      reason: `Temperatura alta (${temperature}°C) con humedad baja (${soilMoisture}%)`,
      urgency: 'alta',
      duration: 20,
    };
  }

  // Prioridad 3: Humedad bajo el mínimo
  if (soilMoisture < config.soilMoistureMin) {
    return {
      shouldIrrigate: true,
      reason: `Humedad del suelo baja (${soilMoisture}% < ${config.soilMoistureMin}%)`,
      urgency: 'normal',
      duration: 15,
    };
  }

  // Prioridad 4: ET0 muy alta
  if (et0 > config.et0Threshold && soilMoisture < config.soilMoistureMin + 20) {
    return {
      shouldIrrigate: true,
      reason: `Alta evapotranspiración (${et0} mm/día) con humedad moderada`,
      urgency: 'alta',
      duration: 20,
    };
  }

  // Prioridad 5: Índice de estrés alto
  if (stressInfo.index > 60) {
    return {
      shouldIrrigate: true,
      reason: `Índice de estrés hídrico ${stressInfo.status} (${stressInfo.index}/100)`,
      urgency: stressInfo.index > 80 ? 'urgente' : 'alta',
      duration: stressInfo.index > 80 ? 25 : 15,
    };
  }

  return {
    shouldIrrigate: false,
    reason: 'Condiciones dentro de parámetros normales',
    urgency: 'normal',
    duration: 0,
  };
}
