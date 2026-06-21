import { useState } from 'react';
import { useSettings, GeneticsType } from '@/context/SettingsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Sprout, Calendar, MapPin, Bell, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { reverseGeocodeCoordinates } from '@/lib/weather';

export function SettingsModal() {
    const settings = useSettings();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [chatId, setChatId] = useState(settings.telegramChatId);

    const handleSaveTelegram = () => {
        settings.setTelegramChatId(chatId);
        toast({
            title: 'Configuración guardada',
            description: 'ID de chat de Telegram guardado en esta sesión.',
        });
    };

    const [localLatitude, setLocalLatitude] = useState(settings.latitude.toString());
    const [localLongitude, setLocalLongitude] = useState(settings.longitude.toString());
    const [isGeocoding, setIsGeocoding] = useState(false);

    const handleSaveLocation = async () => {
        const lat = Number(localLatitude);
        const lng = Number(localLongitude);
        if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            toast({
                title: 'Coordenadas inválidas',
                description: 'Introduce valores válidos: latitud (-90 a 90) y longitud (-180 a 180).',
                variant: 'destructive',
            });
            return;
        }
        setIsGeocoding(true);
        const locationName = await reverseGeocodeCoordinates(lat, lng);
        settings.setLocation(lat, lng, locationName ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        toast({
            title: 'Ubicación actualizada',
            description: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} · ${locationName ?? 'Sin nombre local'}`,
        });
        setIsGeocoding(false);
    };

    const handleCloseAndRefresh = () => {
        setOpen(false);
        // Ensure changes are consistent across app
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajustes de Cultivo</DialogTitle>
                    <DialogDescription>
                        Configura tu ubicación, genética y notificaciones de Magec Grow.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Plant Profile */}
                    <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2 text-emerald-600">
                            <Sprout className="h-4 w-4" />
                            Perfil de Planta
                        </h4>

                        <div className="grid gap-2">
                            <Label htmlFor="genetics">Genética</Label>
                            <Select
                                value={settings.genetics}
                                onValueChange={(val: GeneticsType) => settings.setGenetics(val)}
                            >
                                <SelectTrigger id="genetics">
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Auto">🌿 Cannabis (Autofloreciente)</SelectItem>
                                    <SelectItem value="Feminizada">🌸 Cannabis (Fotodependiente)</SelectItem>
                                    <SelectItem value="Tomato">🍅 Tomate</SelectItem>
                                    <SelectItem value="Pepper">🌶️ Pimiento</SelectItem>
                                    <SelectItem value="PepperCommon">🫑 Pimiento Común</SelectItem>
                                    <SelectItem value="PepperItalian">🌶️ Pimiento Italiano</SelectItem>
                                    <SelectItem value="PepperPadron">🌶️ Pimiento de Padrón</SelectItem>
                                    <SelectItem value="Cucumber">🥒 Pepino</SelectItem>
                                    <SelectItem value="Zucchini">🥬 Calabacín</SelectItem>
                                    <SelectItem value="Watermelon">🍉 Sandía</SelectItem>
                                    <SelectItem value="Potato">🥔 Patata</SelectItem>
                                    <SelectItem value="SweetPotato">🍠 Batata</SelectItem>
                                    <SelectItem value="Lettuce">🥬 Lechuga</SelectItem>
                                    <SelectItem value="Onion">🧅 Cebolla</SelectItem>
                                    <SelectItem value="Garlic">🧄 Ajo</SelectItem>
                                    <SelectItem value="Strawberry">🍓 Fresa</SelectItem>
                                    <SelectItem value="Lemon">🍋 Limonero</SelectItem>
                                    <SelectItem value="Mango">🥭 Mango</SelectItem>
                                    <SelectItem value="Papaya">🌴 Papaya</SelectItem>
                                    <SelectItem value="Parsley">🌿 Perejil</SelectItem>
                                    <SelectItem value="Basil">🌿 Albahaca</SelectItem>
                                    <SelectItem value="Mint">🫖 Menta</SelectItem>
                                    <SelectItem value="Lavender">💜 Lavanda</SelectItem>
                                    <SelectItem value="Rosemary">🌿 Romero</SelectItem>
                                    <SelectItem value="Aloe">🌵 Aloe Vera</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sowDate" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha de Siembra / Germinación
                            </Label>
                            <Input
                                id="sowDate"
                                type="date"
                                value={settings.sowDate || ''}
                                onChange={(e) => settings.setSowDate(e.target.value || null)}
                            />
                        </div>
                    </div>

                    {/* Alert Thresholds */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium flex items-center gap-2 text-amber-600">
                            <ShieldCheck className="h-4 w-4" />
                            Umbrales de Alerta
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="windT" className="text-[10px] uppercase text-muted-foreground font-bold">Viento (km/h)</Label>
                                <Input
                                    id="windT"
                                    type="number"
                                    value={settings.alertWindThreshold}
                                    onChange={(e) => settings.setAlertThresholds(Number(e.target.value), settings.alertMaxTempThreshold, settings.alertMinTempThreshold, settings.alertUvThreshold, settings.alertRainThreshold)}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="uvT" className="text-[10px] uppercase text-muted-foreground font-bold">Índice UV</Label>
                                <Input
                                    id="uvT"
                                    type="number"
                                    value={settings.alertUvThreshold}
                                    onChange={(e) => settings.setAlertThresholds(settings.alertWindThreshold, settings.alertMaxTempThreshold, settings.alertMinTempThreshold, Number(e.target.value), settings.alertRainThreshold)}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="maxT" className="text-[10px] uppercase text-muted-foreground font-bold">Temp. Máx (°C)</Label>
                                <Input
                                    id="maxT"
                                    type="number"
                                    value={settings.alertMaxTempThreshold}
                                    onChange={(e) => settings.setAlertThresholds(settings.alertWindThreshold, Number(e.target.value), settings.alertMinTempThreshold, settings.alertUvThreshold, settings.alertRainThreshold)}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="minT" className="text-[10px] uppercase text-muted-foreground font-bold">Temp. Mín (°C)</Label>
                                <Input
                                    id="minT"
                                    type="number"
                                    value={settings.alertMinTempThreshold}
                                    onChange={(e) => settings.setAlertThresholds(settings.alertWindThreshold, settings.alertMaxTempThreshold, Number(e.target.value), settings.alertUvThreshold, settings.alertRainThreshold)}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="rainT" className="text-[10px] uppercase text-muted-foreground font-bold">Lluvia (mm)</Label>
                                <Input
                                    id="rainT"
                                    type="number"
                                    value={settings.alertRainThreshold}
                                    onChange={(e) => settings.setAlertThresholds(settings.alertWindThreshold, settings.alertMaxTempThreshold, settings.alertMinTempThreshold, settings.alertUvThreshold, Number(e.target.value))}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="timezoneT" className="text-[10px] uppercase text-muted-foreground font-bold">Timezone</Label>
                                <Input
                                    id="timezoneT"
                                    type="text"
                                    value={settings.timezone}
                                    onChange={(e) => settings.setTimezone(e.target.value)}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Telegram Settings */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center gap-2 text-blue-500">
                                <Bell className="h-4 w-4" />
                                Notificaciones Telegram
                            </h4>
                            <a
                                href="/telegram.html"
                                target="_blank"
                                className="text-[10px] text-emerald-600 flex items-center gap-1 hover:underline"
                            >
                                <ExternalLink className="h-3 w-3" /> Guía Bot
                            </a>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="chatId">ID del Chat</Label>
                            <Input
                                id="chatId"
                                placeholder="..."
                                value={chatId}
                                onChange={(e) => setChatId(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>

                        <Button onClick={handleSaveTelegram} size="sm" variant="outline" className="w-full text-xs h-8">
                            Guardar
                        </Button>
                    </div>

                    {/* Location Settings */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium flex items-center gap-2 text-red-500">
                            <MapPin className="h-4 w-4" />
                            Ubicación
                        </h4>

                        <div className="grid gap-2">
                            <Label htmlFor="latitude">Coordenadas GPS</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    id="latitude"
                                    placeholder="Latitud (ej. 28.96348)"
                                    value={localLatitude}
                                    onChange={(e) => setLocalLatitude(e.target.value)}
                                    className="h-8"
                                />
                                <Input
                                    id="longitude"
                                    placeholder="Longitud (ej. -13.55181)"
                                    value={localLongitude}
                                    onChange={(e) => setLocalLongitude(e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveLocation}
                                    size="sm"
                                    className="h-8"
                                    disabled={isGeocoding || !localLatitude || !localLongitude}
                                >
                                    {isGeocoding ? "..." : "Sincronizar"}
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Detectado: <span className="font-medium text-foreground">{settings.locationName}</span>
                            </p>
                            <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-400">
                                ⚠️ <strong>Aviso:</strong> Usa coordenadas reales de tu huerto o terraza para obtener pronóstico y cálculos solares más precisos.
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleCloseAndRefresh} className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
                        Aplicar y Actualizar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
