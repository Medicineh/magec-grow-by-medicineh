import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type AppTheme = 'light' | 'dark' | 'system';

const THEMES: AppTheme[] = ['system', 'light', 'dark'];
const THEME_ICONS: Record<AppTheme, React.ReactNode> = {
    light:  <Sun className="h-4 w-4" />,
    dark:   <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
};
const THEME_LABELS: Record<AppTheme, string> = {
    light:  'Modo claro',
    dark:   'Modo oscuro',
    system: 'Automático (sistema)',
};

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="h-9 w-9" disabled>
                <Monitor className="h-4 w-4" />
            </Button>
        );
    }

    const current = (THEMES.includes(theme as AppTheme) ? theme : 'system') as AppTheme;
    const nextTheme = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-border hover:bg-accent hover:text-accent-foreground transition-all"
                    onClick={() => setTheme(nextTheme)}
                    aria-label={`Tema: ${THEME_LABELS[current]}`}
                >
                    {THEME_ICONS[current]}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p className="text-xs">{THEME_LABELS[current]} → {THEME_LABELS[nextTheme]}</p>
            </TooltipContent>
        </Tooltip>
    );
}
