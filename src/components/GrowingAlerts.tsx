import { GrowingAlert } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, XCircle, Bell } from 'lucide-react';

interface Props {
  alerts: GrowingAlert[];
}

function getSeverityConfig(severity: 'warning' | 'danger') {
  if (severity === 'danger') {
    return {
      icon: XCircle,
      bgClass: 'bg-destructive/10 border-destructive/30',
      badgeColor: 'rgb(239 68 68)',
      label: 'CRÍTICO'
    };
  }
  return {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10 border-amber-500/30',
    badgeColor: 'rgb(234 179 8)',
    label: 'AVISO'
  };
}

export function GrowingAlerts({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertas Agronómicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Condiciones óptimas — Sin alertas activas
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Todos los parámetros ambientales dentro de rangos fisiológicos aceptables
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dangerCount = alerts.filter(a => a.severity === 'danger').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertas Agronómicas
          </CardTitle>
          <div className="flex gap-2">
            {dangerCount > 0 && (
              <Badge style={{ backgroundColor: 'rgb(239 68 68)', color: 'white' }}>
                {dangerCount} crítico{dangerCount > 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge style={{ backgroundColor: 'rgb(234 179 8)', color: 'white' }}>
                {warningCount} aviso{warningCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Sistema de monitoreo continuo — actualización cada 15 min
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, i) => {
          const config = getSeverityConfig(alert.severity);
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-md p-3 text-sm border ${config.bgClass}`}
            >
              <Icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: config.badgeColor }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{alert.icon}</span>
                  <Badge 
                    variant="outline" 
                    style={{ borderColor: config.badgeColor, color: config.badgeColor, fontSize: '9px' }}
                  >
                    {config.label}
                  </Badge>
                  <span className="text-xs uppercase font-semibold tracking-wide">
                    {alert.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          );
        })}
        <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground">
          <Info className="h-3 w-3 inline mr-1" />
          Umbrales calibrados para cultivo exterior en clima subtropical (Kp: Canarias)
        </div>
      </CardContent>
    </Card>
  );
}