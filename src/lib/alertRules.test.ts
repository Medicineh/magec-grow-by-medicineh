import { describe, expect, it } from 'vitest';
import {
  deriveAlertSnapshot,
  findAddedOrEscalatedAlertTypes,
  isGlobalStatusEscalation,
} from './alertRules';

describe('isGlobalStatusEscalation', () => {
  it('detecta escalado de normal a warning y danger', () => {
    expect(isGlobalStatusEscalation('normal', 'warning')).toBe(true);
    expect(isGlobalStatusEscalation('normal', 'danger')).toBe(true);
    expect(isGlobalStatusEscalation(null, 'danger')).toBe(true);
  });

  it('no detecta escalado cuando se mantiene o baja la severidad', () => {
    expect(isGlobalStatusEscalation('danger', 'warning')).toBe(false);
    expect(isGlobalStatusEscalation('warning', 'warning')).toBe(false);
    expect(isGlobalStatusEscalation('warning', 'normal')).toBe(false);
  });
});

describe('findAddedOrEscalatedAlertTypes', () => {
  it('detecta un tipo nuevo', () => {
    expect(
      findAddedOrEscalatedAlertTypes(
        { uv: 'danger' },
        { uv: 'danger', wind: 'warning' },
      ),
    ).toEqual(['wind']);
  });

  it('detecta un escalado de warning a danger', () => {
    expect(
      findAddedOrEscalatedAlertTypes({ wind: 'warning' }, { wind: 'danger' }),
    ).toEqual(['wind']);
  });

  it('ignora una reducción de danger a warning', () => {
    expect(
      findAddedOrEscalatedAlertTypes({ wind: 'danger' }, { wind: 'warning' }),
    ).toEqual([]);
  });

  it('ignora un tipo cuya severidad no cambia', () => {
    expect(
      findAddedOrEscalatedAlertTypes({ wind: 'warning' }, { wind: 'warning' }),
    ).toEqual([]);
  });

  it('detecta el escalado de un tipo aunque otro mantenga el estado global en danger', () => {
    const previousSnapshot = deriveAlertSnapshot([
      { type: 'uv', severity: 'danger', icon: '⚡', message: 'UV extremo' },
      { type: 'wind', severity: 'warning', icon: '🌬️', message: 'Viento fuerte' },
    ]);
    const currentAlerts = [
      { type: 'uv', severity: 'danger', icon: '⚡', message: 'UV extremo' },
      { type: 'wind', severity: 'danger', icon: '🌪️', message: 'Rachas peligrosas' },
    ] as const;
    const currentSnapshot = deriveAlertSnapshot([...currentAlerts]);
    const addedOrEscalatedTypes = findAddedOrEscalatedAlertTypes(
      previousSnapshot,
      currentSnapshot,
    );
    const alertsToNotify = currentAlerts.filter((alert) =>
      addedOrEscalatedTypes.includes(alert.type),
    );

    expect(addedOrEscalatedTypes).toEqual(['wind']);
    expect(alertsToNotify.map((alert) => alert.type)).toEqual(['wind']);
  });
});
