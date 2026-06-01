import React from 'react';
import { useWeather } from '@/hooks/useWeather';
import { getGrowingAlerts } from '@/lib/weather';
import { CurrentWeather } from '@/components/CurrentWeather';
import { SolarInfo } from '@/components/SolarInfo';
import { PlantPhaseCard } from '@/components/PlantPhaseCard';
import { SoilConditions } from '@/components/SoilConditions';
import { WeekForecast } from '@/components/WeekForecast';
import { WindForecast } from '@/components/WindForecast';
import { TempPrecipForecast } from '@/components/TempPrecipForecast';
import { HourlyChart } from '@/components/HourlyChart';
import { DaylightChart } from '@/components/DaylightChart';
import { GrowingAlerts } from '@/components/GrowingAlerts';
import { IrrigationAlerts } from '@/components/IrrigationAlerts';
import { EnvironmentalMetrics } from '@/components/EnvironmentalMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CanaryClock } from '@/components/CanaryClock';
import { SettingsModal } from '@/components/SettingsModal';
import { useSettings } from '@/context/SettingsContext';
import { VpdMonitor } from '@/components/VpdMonitor';
import { MoonPhase } from '@/components/MoonPhase';
import { IrrigationAdvisor } from '@/components/IrrigationAdvisor';
import CultivationTips from '@/components/CultivationTips';
import { CuttingsGuide } from '@/components/CuttingsGuide';
import { RefreshCw, BookOpen, Heart, HelpCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upsertAlertSubscription } from '@/lib/alertSubscriptions';
import { AlertTraceabilityCard } from '@/components/AlertTraceabilityCard';

const Index = () => {
  const { data, isLoading, error, dataUpdatedAt, refetch, isFetching } = useWeather();
  const settings = useSettings();
  const isCannabisProfile = settings.genetics === 'Auto' || settings.genetics === 'Feminizada';
  const plantMenu = isCannabisProfile
    ? ['Clima', 'VPD', 'Fase', 'Esquejes', 'Alertas']
    : ['Clima', 'Riego', 'Fase', 'Consejos', 'Alertas'];
  const alerts = React.useMemo(() => (data ? getGrowingAlerts(data, {
    wind: settings.alertWindThreshold,
    maxTemp: settings.alertMaxTempThreshold,
    minTemp: settings.alertMinTempThreshold,
    uv: settings.alertUvThreshold,
    rain: settings.alertRainThreshold
  }, settings.timezone) : []), [data, settings.alertWindThreshold, settings.alertMaxTempThreshold, settings.alertMinTempThreshold, settings.alertUvThreshold, settings.alertRainThreshold, settings.timezone]);


  React.useEffect(() => {
    if (!settings.telegramChatId) return;

    upsertAlertSubscription({
      locationName: settings.locationName,
      latitude: settings.latitude,
      longitude: settings.longitude,
      timezone: settings.timezone,
      chatId: settings.telegramChatId,
      thresholds: {
        wind: settings.alertWindThreshold,
        maxTemp: settings.alertMaxTempThreshold,
        minTemp: settings.alertMinTempThreshold,
        uv: settings.alertUvThreshold,
        rain: settings.alertRainThreshold,
      },
    });
  }, [settings.locationName, settings.latitude, settings.longitude, settings.timezone, settings.telegramChatId, settings.alertWindThreshold, settings.alertMaxTempThreshold, settings.alertMinTempThreshold, settings.alertUvThreshold, settings.alertRainThreshold]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-2">
          <p className="text-2xl">⚠️</p>
          <p className="text-destructive font-medium">Error al cargar datos meteorológicos</p>
          <p className="text-sm text-muted-foreground">Comprueba tu conexión e inténtalo de nuevo.</p>
          <button onClick={() => refetch()} className="text-sm underline text-primary">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary">☀️</span>
              Magec Grow
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">
                {settings.genetics} · Panel de Cultivo Inteligente
              </p>
              <CanaryClock />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* High Visibility Actions */}
            <div className="hidden sm:flex items-center gap-2 border-r pr-4 mr-2">
              <a
                href="/donar.html"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold hover:bg-amber-500/20 transition-all border border-amber-500/20 shadow-sm"
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
                Donar
              </a>
              <a
                href="/telegram.html"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-500/20 transition-all border border-blue-500/20 shadow-sm"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Ayuda
              </a>
            </div>

            {dataUpdatedAt > 0 && (
              <span className="text-xs text-muted-foreground hidden md:inline">
                {new Date(dataUpdatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <Link to="/diario" className="p-2 rounded-md hover:bg-muted transition-colors" title="Diario de Cultivo">
              <BookOpen className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <ThemeToggle />
            <SettingsModal />
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {plantMenu.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border bg-card text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* 1. Critical Alerts */}
            {alerts.length > 0 && <GrowingAlerts alerts={alerts} />}

            {/* 2. Top row: Essential Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrentWeather data={data.current} />
              <EnvironmentalMetrics data={data} />
            </div>

            {/* 3. Detailed Monitors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <VpdMonitor
                temperature={data.current.temperature}
                humidity={data.current.humidity}
              />
              <IrrigationAdvisor currentData={data.current} />
              {isCannabisProfile ? <MoonPhase /> : <IrrigationAlerts />}
              <SoilConditions hourly={data.hourly} />
            </div>

            {/* 4. Agricultural Context Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlantPhaseCard />
              <SolarInfo />
              {isCannabisProfile ? <CuttingsGuide /> : <IrrigationAlerts />}
            </div>

            {/* 5. Visual Trends (Charts) */}
            <div className="grid grid-cols-1 gap-6">
              <DaylightChart />
              <HourlyChart hourly={data.hourly} />
            </div>

            {/* 6. Forecasts (Planning) */}
            <div className="space-y-6 border-t pt-6">
              <WeekForecast daily={data.daily} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WindForecast daily={data.daily} />
                <TempPrecipForecast daily={data.daily} />
              </div>
            </div>

            {/* 7. Tips & Secondary Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CultivationTips />
              {isCannabisProfile ? <IrrigationAlerts /> : <MoonPhase />}
            </div>

            {alerts.length === 0 && (
              <GrowingAlerts alerts={alerts} />
            )}

            <AlertTraceabilityCard />
          </>
        ) : null}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground space-y-4">
        <div className="flex justify-center gap-6">
          <a href="/telegram.html" target="_blank" className="hover:text-primary transition-colors hover:underline">Guía Telegram</a>
          <a href="/donar.html" target="_blank" className="text-amber-500 font-bold hover:text-amber-600 transition-colors flex items-center gap-1">
            <span>☕</span> Donar (Mantenimiento)
          </a>
        </div>
        <div>
          Magec Grow 2026 · Lanzarote, Canarias · v2.2
        </div>
      </footer>
    </div>
  );
};

export default Index;
