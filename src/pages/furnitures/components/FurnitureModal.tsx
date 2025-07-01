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
import type { Furniture } from "@/store/api/types/furnituresTypes";
import { useEffect, useState } from "react";

interface FurnitureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedFurniture: Furniture | null;
    onSave: (furnitureData: Partial<Furniture>) => void;
}

const statusOptions = ["En stock", "Épuisé", "En commande"];

export function FurnitureModal({
    open,
    onOpenChange,
    isCreating,
    selectedFurniture,
    onSave,
}: FurnitureModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);

    // Charger les informations du meuble (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedFurniture && open && !isCreating) {
            setName(selectedFurniture.name);
            setDescription(selectedFurniture.description || "");
            setStatus(selectedFurniture.status);
            setCategory(selectedFurniture.idCategory);
            setStock(selectedFurniture.quantity);
            // setImage(selectedFurniture.image);
        } else if (open && isCreating) {
            setName("");
            setDescription("");
            setStatus("En stock");
            setCategory("");
            setStock(0);
            // setImage("");
        }
    }, [selectedFurniture, open, isCreating]);
    //TODO: Add Validator
    // Handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setStock(value);
    };

    const handleSave = () => {
        const furnitureData = {
            name,
            description,
            status,
            idCategory: category,
            stock,
        };

        onSave(furnitureData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter un meuble"
                            : "Modifier le meuble"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer un nouveau meuble"
                            : `Modification des informations de ${selectedFurniture?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du meuble</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Ex: Canapé 3 places"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Description détaillée du meuble..."
                            rows={3}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2 w-full flex flex-row gap-2 justify-between">
                        <div className="flex flex-col space-y-2 w-full">
                            <Label>Catégorie</Label>
                            <Select
                                value={category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="armoire">
                                        Armoire
                                    </SelectItem>
                                    <SelectItem value="etagere">
                                        Etagère
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-2 w-full">
                            <Label>Statut</Label>
                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((statusOption) => (
                                        <SelectItem
                                            key={statusOption}
                                            value={statusOption}
                                        >
                                            {statusOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {status === "En stock" && (
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock disponible</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={stock}
                                onChange={handleStockChange}
                                placeholder="0"
                            />
                        </div>
                    )}

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
