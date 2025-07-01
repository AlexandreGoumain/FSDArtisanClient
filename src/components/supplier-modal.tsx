import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

// Types
interface Supplier {
    id: string;
    name: string;
    contact: {
        email: string;
        phone: string;
    };
    category: {
        name: string;
        color: string;
    };
    status: "Actif" | "En attente";
    lastOrder: string;
    iconColor: string;
}

interface SupplierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedSupplier: Supplier | null;
    onSave: (supplierData: Partial<Supplier>) => void;
}

const categories = ["Bois", "Fer", "Plastique"];

export function SupplierModal({
    open,
    onOpenChange,
    isCreating,
    selectedSupplier,
    onSave,
}: SupplierModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [time, setTime] = useState("");

    // Charger les informations du fournisseur (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedSupplier && open && !isCreating) {
            setName(selectedSupplier.name);
            setEmail(selectedSupplier.contact.email);
            setPhone(selectedSupplier.contact.phone);
            setCategory(selectedSupplier.category.name);
            setStatus(selectedSupplier.status);
            setDate(new Date(selectedSupplier.lastOrder));
            setTime(selectedSupplier.lastOrder.split("T")[1]);
        } else if (open && isCreating) {
            setName("");
            setEmail("");
            setPhone("");
            setCategory("");
            setStatus("Actif");
            setDate(new Date());
            setTime("10:00");
        }
    }, [selectedSupplier, open, isCreating]);

    // Handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
    };

    const handleSave = () => {
        const supplierData = {
            name,
            contact: {
                email,
                phone,
            },
            category: {
                name: category,
                color: getCategoryColor(category),
            },
            status: status as "Actif" | "En attente",
            lastOrder:
                date && time
                    ? `${date.toISOString().split("T")[0]}T${time}:00`
                    : new Date().toISOString(),
            iconColor: getCategoryIconColor(category),
        };

        onSave(supplierData);
        onOpenChange(false);
    };

    const getCategoryColor = (categoryName: string) => {
        const colorMap: Record<string, string> = {
            Bois: "bg-blue-100 text-blue-800",
            Fer: "bg-green-100 text-green-800",
            Plastique: "bg-purple-100 text-purple-800",
        };
        return colorMap[categoryName] || "bg-gray-100 text-gray-800";
    };

    const getCategoryIconColor = (categoryName: string) => {
        const colorMap: Record<string, string> = {
            Bois: "bg-blue-500",
            Fer: "bg-green-500",
            Plastique: "bg-purple-500",
        };
        return colorMap[categoryName] || "bg-gray-500";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter un fournisseur"
                            : "Modifier le fournisseur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer un nouveau fournisseur"
                            : `Modification des informations de ${selectedSupplier?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-4">
                        <Label>Nom</Label>
                        <Input value={name} onChange={handleNameChange} />
                    </div>

                    <div className="space-y-4">
                        <Label>Email</Label>
                        <Input value={email} onChange={handleEmailChange} />
                    </div>

                    <div className="space-y-4">
                        <Label>Téléphone</Label>
                        <Input value={phone} onChange={handlePhoneChange} />
                    </div>

                    <div className="space-y-4">
                        <Label>Catégorie</Label>
                        <Select
                            value={category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Statut</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Actif">Actif</SelectItem>
                                <SelectItem value="En attente">
                                    En attente
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Dernière commande</Label>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date-picker" className="px-1">
                                    Date
                                </Label>
                                <Popover
                                    open={calendarOpen}
                                    onOpenChange={setCalendarOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date-picker"
                                            className="w-32 justify-between font-normal"
                                        >
                                            {date
                                                ? date.toLocaleDateString()
                                                : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date);
                                                setCalendarOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="time-picker" className="px-1">
                                    Heure
                                </Label>
                                <Input
                                    type="time"
                                    id="time-picker"
                                    step="1"
                                    value={time}
                                    onChange={handleTimeChange}
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleSave}>
                            {isCreating ? "Créer" : "Sauvegarder"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
