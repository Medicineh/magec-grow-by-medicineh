import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '@/lib/weather';
import { useSettings } from '@/context/SettingsContext';

export function useWeather() {
  const { latitude, longitude } = useSettings();

  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => fetchWeather(latitude, longitude),
    refetchInterval: 15 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}
