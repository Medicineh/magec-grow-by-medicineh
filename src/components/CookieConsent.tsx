import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getCookie, setCookie } from '@/lib/cookies';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar si ya se ha dado el consentimiento
        const consent = getCookie('cookie-consent-accepted');
        if (!consent) {
            // Mostrar después de un pequeño retraso para mejorar el UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setCookie('cookie-consent-accepted', 'true', 365);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Card className="max-w-2xl w-full p-4 md:p-6 bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl ring-1 ring-primary/20">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                        <Cookie className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-base">Aviso de Cookies 🍪</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Solo usamos una cookie técnica para recordar tu consentimiento y mejorar la seguridad del aviso.
                            Tus ajustes sensibles ahora se guardan de forma temporal en la sesión del navegador.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto pt-2 md:pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsVisible(false)}
                            className="text-muted-foreground"
                        >
                            Ahora no
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleAccept}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20"
                        >
                            Aceptar y guardar
                        </Button>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </Card>
        </div>
    );
}
