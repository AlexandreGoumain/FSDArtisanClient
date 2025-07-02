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

import { useGetAllRessourcesCategoriesQuery } from "@/store/api/ressourcesCategoriesApi";
import { useGetAllSuppliersQuery } from "@/store/api/suppliersApi";
import type { Ressource } from "@/store/api/types/ressourcesType";
import { useEffect, useState } from "react";

interface RessourceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedRessource: Ressource | null;
    onSave: (ressourceData: Partial<Ressource>) => void;
}

export function RessourceModal({
    open,
    onOpenChange,
    isCreating,
    selectedRessource,
    onSave,
}: RessourceModalProps) {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [description, setDescription] = useState("");

    const {
        data: categories,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetAllRessourcesCategoriesQuery();

    const {
        data: suppliers,
        isLoading: isSuppliersLoading,
        isError: isSuppliersError,
    } = useGetAllSuppliersQuery();

    useEffect(() => {
        if (selectedRessource && open && !isCreating) {
            setName(selectedRessource.name);
            setCategoryId(selectedRessource.idCategory);
            setSupplierId(selectedRessource.idSupplier);
            setDescription(selectedRessource.description);
        } else if (open && isCreating) {
            setName("");
            setCategoryId("");
            setSupplierId("");
            setDescription("");
        }
    }, [selectedRessource, open, isCreating]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
    };

    const handleSupplierChange = (value: string) => {
        setSupplierId(value);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value);
    };

    const handleSave = () => {
        const ressourceData = {
            name,
            idCategory: categoryId,
            idSupplier: supplierId,
            description,
        };

        onSave(ressourceData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Ex: De 2m à 4m"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select
                            value={categoryId}
                            onValueChange={handleCategoryChange}
                            disabled={isCategoriesLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {!isCategoriesLoading &&
                                    !isCategoriesError &&
                                    categories?.map((category) => (
                                        <SelectItem
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                {isCategoriesLoading && (
                                    <SelectItem value="" disabled>
                                        Chargement...
                                    </SelectItem>
                                )}
                                {isCategoriesError && (
                                    <SelectItem value="" disabled>
                                        Erreur de chargement
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Fournisseur</Label>
                        <Select
                            value={supplierId}
                            onValueChange={handleSupplierChange}
                            disabled={isSuppliersLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un fournisseur" />
                            </SelectTrigger>
                            <SelectContent>
                                {!isSuppliersLoading &&
                                    !isSuppliersError &&
                                    suppliers?.map((supplier) => (
                                        <SelectItem
                                            key={supplier._id}
                                            value={supplier._id}
                                        >
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                {isSuppliersLoading && (
                                    <SelectItem value="" disabled>
                                        Chargement des fournisseurs...
                                    </SelectItem>
                                )}
                                {isSuppliersError && (
                                    <SelectItem value="" disabled>
                                        Erreur de chargement des fournisseurs
                                    </SelectItem>
                                )}
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
