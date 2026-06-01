// Lanzarote, Spain coordinates
const LAT = 29.0469;
const LNG = -13.5899;

function toRad(deg: number) { return deg * Math.PI / 180; }
function toDeg(rad: number) { return rad * 180 / Math.PI; }

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getSolarData(date: Date, latitude: number = LAT, longitude: number = LNG) {
  const dayOfYear = getDayOfYear(date);

  // Solar declination (Spencer formula approximation)
  const B = (2 * Math.PI / 365) * (dayOfYear - 1);
  const declination = toDeg(
    0.006918 - 0.399912 * Math.cos(B) + 0.070257 * Math.sin(B)
    - 0.006758 * Math.cos(2 * B) + 0.000907 * Math.sin(2 * B)
    - 0.002697 * Math.cos(3 * B) + 0.00148 * Math.sin(3 * B)
  );

  // Hour angle at sunrise/sunset
  const latRad = toRad(latitude);
  const decRad = toRad(declination);
  const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);

  // Clamp for polar regions (not needed for Lanzarote but safe)
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngle = toDeg(Math.acos(clampedCos));

  // Day length in hours
  const dayLengthHours = (2 * hourAngle) / 15;
  const nightLengthHours = 24 - dayLengthHours;

  // Equation of time (minutes)
  const EoT = 229.18 * (0.000075 + 0.001868 * Math.cos(B) - 0.032077 * Math.sin(B)
    - 0.014615 * Math.cos(2 * B) - 0.04089 * Math.sin(2 * B));

  // Solar noon in hours (UTC)
  const solarNoon = 12 - longitude / 15 - EoT / 60;

  // Sunrise/sunset in hours (UTC) — Lanzarote is UTC+0 (winter) / UTC+1 (summer)
  const offset = isDST(date) ? 1 : 0;
  const sunriseUTC = solarNoon - hourAngle / 15;
  const sunsetUTC = solarNoon + hourAngle / 15;

  const sunrise = sunriseUTC + offset;
  const sunset = sunsetUTC + offset;

  return {
    dayLengthHours,
    nightLengthHours,
    sunrise: hoursToTime(sunrise),
    sunset: hoursToTime(sunset),
    sunriseDecimal: sunrise,
    sunsetDecimal: sunset,
    declination,
    dayOfYear,
  };
}

function isDST(date: Date): boolean {
  // Spain/Canary Islands: last Sunday of March to last Sunday of October
  const year = date.getFullYear();
  const marchLast = new Date(year, 2, 31);
  const dstStart = new Date(year, 2, 31 - marchLast.getDay());
  const octLast = new Date(year, 9, 31);
  const dstEnd = new Date(year, 9, 31 - octLast.getDay());
  return date >= dstStart && date < dstEnd;
}

function hoursToTime(h: number): string {
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatHours(h: number): string {
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  return `${hours}h ${minutes}m`;
}

// Plant phase determination based on photoperiod changes
export type PlantPhase = 'germination' | 'vegetative' | 'pre-flowering' | 'flowering' | 'fruiting' | 'dormancy';

export interface PlantPhaseInfo {
  phase: PlantPhase;
  label: string;
  description: string;
  icon: string;
  tip: string;
  progress: number; // 0-100
}

export function getPlantPhase(date: Date, latitude: number = LAT, longitude: number = LNG): PlantPhaseInfo {
  const { dayLengthHours } = getSolarData(date, latitude, longitude);
  const dayOfYear = getDayOfYear(date);
  const month = date.getMonth(); // 0-indexed

  // Determine if days are getting longer or shorter
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowData = getSolarData(tomorrow, latitude, longitude);
  const daysGettingLonger = tomorrowData.dayLengthHours > dayLengthHours;

  // Photoperiod-based plant phases for Lanzarote
  if (month >= 11 || month <= 0) {
    // Dec-Jan: Dormancy / slow growth (shortest days ~10.3h)
    return {
      phase: 'dormancy',
      label: 'Dormancy / Rest',
      description: `Days are short (~${dayLengthHours.toFixed(1)}h). Plants conserve energy. Many perennials rest. Root development continues underground.`,
      icon: '🌙',
      tip: 'Reduce watering. Prune deciduous plants. Plan spring garden. Protect frost-sensitive species.',
      progress: 15,
    };
  }

  if (month >= 1 && month <= 2) {
    // Feb-Mar: Germination (days lengthening past 11h)
    return {
      phase: 'germination',
      label: 'Germination & Awakening',
      description: `Days growing longer (${dayLengthHours.toFixed(1)}h). Increasing light triggers seed germination and bud break. Soil warming begins.`,
      icon: '🌱',
      tip: 'Start seeds indoors or direct sow. Prepare soil with compost. Begin gentle fertilizing.',
      progress: 30,
    };
  }

  if (month >= 3 && month <= 4) {
    // Apr-May: Vegetative growth (days 12-13.5h, rapidly increasing)
    return {
      phase: 'vegetative',
      label: 'Vegetative Growth',
      description: `Long, increasing days (${dayLengthHours.toFixed(1)}h) drive vigorous leaf and stem growth. Plants build energy reserves through photosynthesis.`,
      icon: '🌿',
      tip: 'Feed with nitrogen-rich fertilizer. Ensure consistent watering. Stake tall plants. Watch for pests.',
      progress: 50,
    };
  }

  if (month === 5) {
    // June: Pre-flowering (approaching summer solstice ~13.8h)
    return {
      phase: 'pre-flowering',
      label: 'Pre-Flowering',
      description: `Near peak daylight (${dayLengthHours.toFixed(1)}h). Plants sense the approaching solstice and begin redirecting energy to reproductive structures.`,
      icon: '🌼',
      tip: 'Switch to phosphorus-rich fertilizer. Reduce nitrogen. Ensure good air circulation.',
      progress: 65,
    };
  }

  if (month >= 6 && month <= 7) {
    // Jul-Aug: Flowering (days shortening from peak, 12.5-13.5h)
    return {
      phase: 'flowering',
      label: 'Flowering & Blooming',
      description: `Days shortening (${dayLengthHours.toFixed(1)}h) triggers flowering in many species. Short-day response initiates bloom cycles.`,
      icon: '🌸',
      tip: 'Deadhead spent blooms. Keep soil moist. Protect from intense midday sun. Harvest herbs.',
      progress: 80,
    };
  }

  if (month >= 8 && month <= 9) {
    // Sep-Oct: Fruiting/Harvest (days dropping below 12h)
    return {
      phase: 'fruiting',
      label: 'Fruiting & Harvest',
      description: `Shortening days (${dayLengthHours.toFixed(1)}h) signal plants to ripen fruit and set seed. Energy moves from leaves to fruits.`,
      icon: '🍅',
      tip: 'Harvest ripe produce regularly. Begin saving seeds. Start planning winter crops. Reduce watering gradually.',
      progress: 90,
    };
  }

  // Oct-Nov: Transition to dormancy
  return {
    phase: 'dormancy',
    label: 'Autumn Transition',
    description: `Days rapidly shortening (${dayLengthHours.toFixed(1)}h). Plants prepare for winter rest. Leaves may yellow as chlorophyll breaks down.`,
    icon: '🍂',
    tip: 'Plant winter vegetables. Mulch beds. Clean up dead foliage. Apply slow-release fertilizer.',
    progress: 5,
  };
}

// Get yearly data for chart
export function getYearlyData(year: number, latitude: number = LAT, longitude: number = LNG) {
  const data = [];
  for (let day = 1; day <= 365; day++) {
    const date = new Date(year, 0, day);
    if (date.getFullYear() !== year) break;
    const solar = getSolarData(date, latitude, longitude);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayLength: parseFloat(solar.dayLengthHours.toFixed(2)),
      nightLength: parseFloat(solar.nightLengthHours.toFixed(2)),
      month: date.getMonth(),
    });
  }
  return data;
}
