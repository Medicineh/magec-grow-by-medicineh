import { useState, useEffect } from 'react';

export function CanaryClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date().toLocaleTimeString('es-ES', {
        timeZone: 'Atlantic/Canary',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTime(now);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <span>{time}</span>
      <span className="text-[10px] opacity-60">WET</span>
    </div>
  );
}
