import { describe, it, expect, vi, afterEach } from 'vitest';

import { geocodePostalCode } from './weather';

describe('geocodePostalCode', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('encodes special characters in postal code before fetching', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await geocodePostalCode('28013/Á');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=28013%2F%C3%81&count=1&language=es&format=json',
    );
  });

  it('trims spaces before encoding and fetching', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await geocodePostalCode('  35 500  ');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=35%20500&count=1&language=es&format=json',
    );
  });

  it('returns null early for empty input without calling fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await geocodePostalCode('   ');

    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
