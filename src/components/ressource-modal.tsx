import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";

// Types
interface Ressource {
    id: string;
    name: string;
    category: {
        name: string;
        color: string;
    };
    quantity: number;
    unit: string;
    iconColor: string;
}

interface RessourceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedRessource: Ressource | null;
    onSave: (ressourceData: Partial<Ressource>) => void;
}

const categoryOptions = [
    { name: "Bois", color: "bg-blue-100 text-blue-800" },
    { name: "Fer", color: "bg-green-100 text-green-800" },
    { name: "Plastique", color: "bg-purple-100 text-purple-800" },
    { name: "Quincaillerie", color: "bg-orange-100 text-orange-800" },
];

const unitOptions = ["unité", "m²", "m³", "kg", "litre", "tonne", "lot"];

const iconColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
];

export function RessourceModal({
    open,
    onOpenChange,
    isCreating,
    selectedRessource,
    onSave,
}: RessourceModalProps) {
    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState("");

    // Charger les informations de la ressource (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedRessource && open && !isCreating) {
            setName(selectedRessource.name);
            setCategoryName(selectedRessource.category.name);
            setQuantity(selectedRessource.quantity);
            setUnit(selectedRessource.unit);
        } else if (open && isCreating) {
            setName("");
            setCategoryName("Bois");
            setQuantity(0);
            setUnit("unité");
        }
    }, [selectedRessource, open, isCreating]);

    // Handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setQuantity(value);
    };

    const handleSave = () => {
        const selectedCategory = categoryOptions.find(
            (cat) => cat.name === categoryName
        );
        const randomIconColor =
            iconColors[Math.floor(Math.random() * iconColors.length)];

        const ressourceData = {
            name,
            category: selectedCategory || categoryOptions[0],
            quantity,
            unit,
            iconColor: selectedRessource?.iconColor || randomIconColor,
        };

        onSave(ressourceData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter une ressource"
                            : "Modifier la ressource"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer une nouvelle ressource"
                            : `Modification des informations de ${selectedRessource?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de la ressource</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Ex: Planches de chêne"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select
                            value={categoryName}
                            onValueChange={setCategoryName}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((category) => (
                                    <SelectItem
                                        key={category.name}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantité</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Unité</Label>
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une unité" />
                            </SelectTrigger>
                            <SelectContent>
                                {unitOptions.map((unitOption) => (
                                    <SelectItem
                                        key={unitOption}
                                        value={unitOption}
                                    >
                                        {unitOption}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
