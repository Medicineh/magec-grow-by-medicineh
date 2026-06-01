import { getSolarData, getDayOfYear, getYearlyData } from '@/lib/solar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sprout } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { getBotanyLogic } from '@/lib/botany';

export function PlantPhaseCard() {
  const { genetics, sowDate, latitude, longitude } = useSettings();
  const year = new Date().getFullYear();
  const todayDOY = getDayOfYear(new Date());
  const todayData = getYearlyData(year, latitude, longitude)[todayDOY - 1];
  const lightHours = todayData?.dayLength || 12;
  const darkHours = 24 - lightHours;

  const { phase, isAuto } = getBotanyLogic(genetics, sowDate, todayDOY, lightHours);
  const progress = phase.progress;
  const ratio = `${lightHours.toFixed(0)}/${darkHours.toFixed(0)}`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-500" />
          Fase Actual: {
            {
              Tomato: 'Tomate',
              Pepper: 'Pimiento',
              Aloe: 'Aloe Vera',
              Papaya: 'Papaya',
              Mango: 'Mango',
              Basil: 'Albahaca',
              Mint: 'Menta',
              Lavender: 'Lavanda',
              Auto: 'Cannabis (Autofloreciente)',
              Feminizada: 'Cannabis (Fotodependiente)'
            }[genetics as string] || genetics
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fotoperíodo actual */}
        <div className="bg-muted/30 rounded-lg p-3 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              📅 {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </span>
            <span className="text-xs text-muted-foreground">Día {todayDOY}/365</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">☀️</span>
              <div>
                <div className="font-medium">{lightHours.toFixed(1)}h luz</div>
                <div className="text-xs text-muted-foreground">Fotoperíodo activo</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🌙</span>
              <div>
                <div className="font-medium">{darkHours.toFixed(1)}h oscuridad</div>
                <div className="text-xs text-muted-foreground">Escotoperíodo</div>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>Ratio L/O: <strong className="text-foreground">{ratio}</strong></span>
            {isAuto && (
              <span className="text-purple-500 font-medium">Auto: Ignora fotoperiodo</span>
            )}
          </div>
        </div>

        {/* Fase actual */}
        <div>
          <h3 className={`font-semibold text-base mb-1 ${phase.colorClass}`}>
            {phase.label}
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{phase.description}</p>
        </div>

        {/* Indicadores */}
        {phase.characteristics.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2 text-muted-foreground">Indicadores observables:</p>
            <div className="flex flex-wrap gap-1">
              {phase.characteristics.map((char, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full border">
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progreso del ciclo seleccionado */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progreso de Fase</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Consejo de cultivo */}
        {phase.tip && (
          <div className="rounded-md p-3 bg-muted/50 border border-border">
            <p className="text-xs font-medium flex items-center gap-1 mb-1 text-primary">
              🌱 Recomendación de cultivo
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{phase.tip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
