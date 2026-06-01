import { useState } from 'react';
import { useLogbook, LogEntry } from '@/hooks/useLogbook';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/context/SettingsContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsModal } from '@/components/SettingsModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, BookOpen, Droplets, Leaf, Bug, Scissors, Image as ImageIcon, Plus, Trash2, Heart, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPE_ICONS = {
    Riego: <Droplets className="h-4 w-4 text-blue-500" />,
    Abono: <Leaf className="h-4 w-4 text-green-500" />,
    Poda: <Scissors className="h-4 w-4 text-yellow-500" />,
    Plagas: <Bug className="h-4 w-4 text-red-500" />,
    Cosecha: <Leaf className="h-4 w-4 text-orange-500" />,
    Nota: <BookOpen className="h-4 w-4 text-muted-foreground" />,
};

export default function Logbook() {
    const { entries, addEntry, deleteEntry } = useLogbook();

    const [isAdding, setIsAdding] = useState(false);
    const [newEntry, setNewEntry] = useState<Partial<LogEntry>>({
        type: 'Nota',
        date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm format for input type="datetime-local"
        description: '',
    });

    const handleSave = () => {
        if (!newEntry.description?.trim()) return;
        addEntry({
            date: new Date(newEntry.date || Date.now()).toISOString(),
            type: newEntry.type as LogEntry['type'],
            description: newEntry.description,
            images: []
        });
        setIsAdding(false);
        setNewEntry({
            type: 'Nota',
            date: new Date().toISOString().slice(0, 16),
            description: '',
        });
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <span className="text-primary">☀️</span>
                                Magec Grow
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Diario de Cultivo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* High Visibility Actions */}
                        <div className="hidden sm:flex items-center gap-2 border-r pr-4 mr-2">
                            <a
                                href="/donar.html"
                                target="_blank"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold hover:bg-amber-500/20 transition-all border border-amber-500/20"
                            >
                                <Heart className="h-3.5 w-3.5 fill-current" />
                                Donar
                            </a>
                            <a
                                href="/telegram.html"
                                target="_blank"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-500/20 transition-all border border-blue-500/20"
                            >
                                <HelpCircle className="h-3.5 w-3.5" />
                                Ayuda
                            </a>
                        </div>
                        <ThemeToggle />
                        <SettingsModal />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                        {entries.length} {entries.length === 1 ? 'entrada registrada' : 'entradas registradas'}
                    </p>
                    <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
                        {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-2" /> Nueva Entrada</>}
                    </Button>
                </div>

                {/* Add Entry Form */}
                {isAdding && (
                    <Card className="border-primary/50 shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Nueva Anotación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Acción</Label>
                                    <Select
                                        value={newEntry.type}
                                        onValueChange={(val) => setNewEntry({ ...newEntry, type: val as LogEntry['type'] })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Abono">Abono / Nutrientes</SelectItem>
                                            <SelectItem value="Cosecha">Cosecha</SelectItem>
                                            <SelectItem value="Nota">Nota General</SelectItem>
                                            <SelectItem value="Plagas">Tratamiento Plagas</SelectItem>
                                            <SelectItem value="Poda">Poda / Entrenamiento</SelectItem>
                                            <SelectItem value="Riego">Riego</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha y Hora</Label>
                                    <Input
                                        type="datetime-local"
                                        value={newEntry.date}
                                        onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción de lo realizado</Label>
                                <Textarea
                                    placeholder="Aplicado 2ml/L Neem, defoliación ligera..."
                                    value={newEntry.description}
                                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button onClick={handleSave} disabled={!newEntry.description?.trim()}>
                                    Guardar en el Diario
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Entries List */}
                <div className="space-y-4">
                    {entries.length === 0 && !isAdding ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                            <h3 className="text-lg font-medium">El diario está vacío</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Registra tus riegos, abonados o incidentes para llevar un seguimiento.
                            </p>
                            <Button variant="outline" className="mt-4" onClick={() => setIsAdding(true)}>
                                Añadir tu primera nota
                            </Button>
                        </div>
                    ) : (
                        entries.map(entry => (
                            <Card key={entry.id} className="overflow-hidden transition-all hover:shadow-md">
                                <div className="flex items-stretch">
                                    <div className="w-2 bg-primary/20 shrink-0" />
                                    <div className="p-4 flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-muted rounded-md">
                                                    {TYPE_ICONS[entry.type]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{entry.type}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(entry.date), "d 'de' MMMM, HH:mm", { locale: es })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                                onClick={() => deleteEntry(entry.id)}
                                                title="Borrar entrada"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed mt-3">
                                            {entry.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
