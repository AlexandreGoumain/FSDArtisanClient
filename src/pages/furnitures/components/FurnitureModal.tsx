import { Badge } from "@/components/ui/badge";
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
import { useGetAllFurnitureCategoriesQuery } from "@/store/api/furnitureCategoriesApi";
import { useGetAllRessourcesQuery } from "@/store/api/ressourcesApi";
import type {
    Furniture,
    FurnitureCreate,
} from "@/store/api/types/furnituresTypes";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface FurnitureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedFurniture: Furniture | null;
    onSave: (furnitureData: FurnitureCreate) => void;
}

const statusOptions = [
    { value: "waiting", label: "En attente" },
    { value: "in_production", label: "En production" },
    { value: "ready_to_sell", label: "Prêt à vendre" },
];

type SelectedResource = {
    idRessource: string;
    quantity: number;
    name?: string; // Pour l'affichage
};

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
    const [selectedResources, setSelectedResources] = useState<
        SelectedResource[]
    >([]);
    const [resourceToAdd, setResourceToAdd] = useState("");
    const [resourceQuantity, setResourceQuantity] = useState(1);

    // Récupération des données
    const {
        data: categories,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useGetAllFurnitureCategoriesQuery();

    const {
        data: resources,
        isLoading: isResourcesLoading,
        isError: isResourcesError,
    } = useGetAllRessourcesQuery();

    // Charger les informations du meuble (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedFurniture && open && !isCreating) {
            setName(selectedFurniture.name);
            setDescription(selectedFurniture.description || "");
            setStatus(selectedFurniture.status);
            setCategory(selectedFurniture.idCategory);
            setStock(selectedFurniture.quantity);

            // Charger les ressources existantes
            const furnitureResources = selectedFurniture.ressources.map(
                (res) => ({
                    idRessource: res.idRessource,
                    quantity: res.quantity,
                    name:
                        resources?.find((r) => r._id === res.idRessource)
                            ?.name || "Ressource inconnue",
                })
            );
            setSelectedResources(furnitureResources);
        } else if (open && isCreating) {
            setName("");
            setDescription("");
            setStatus("waiting");
            setCategory("");
            setStock(0);
            setSelectedResources([]);
        }
        setResourceToAdd("");
        setResourceQuantity(1);
    }, [selectedFurniture, open, isCreating, resources]);

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

    const handleResourceAdd = () => {
        if (!resourceToAdd || resourceQuantity <= 0) return;

        // Vérifier si la ressource n'est pas déjà ajoutée
        if (
            selectedResources.some((res) => res.idRessource === resourceToAdd)
        ) {
            return;
        }

        const resourceName =
            resources?.find((r) => r._id === resourceToAdd)?.name ||
            "Ressource inconnue";

        setSelectedResources([
            ...selectedResources,
            {
                idRessource: resourceToAdd,
                quantity: resourceQuantity,
                name: resourceName,
            },
        ]);

        setResourceToAdd("");
        setResourceQuantity(1);
    };

    const handleResourceRemove = (idRessource: string) => {
        setSelectedResources(
            selectedResources.filter((res) => res.idRessource !== idRessource)
        );
    };

    const handleResourceQuantityChange = (
        idRessource: string,
        newQuantity: number
    ) => {
        setSelectedResources(
            selectedResources.map((res) =>
                res.idRessource === idRessource
                    ? { ...res, quantity: newQuantity }
                    : res
            )
        );
    };

    const handleSave = () => {
        const furnitureData: FurnitureCreate = {
            name,
            description,
            status: status as "waiting" | "in_production" | "ready_to_sell",
            idCategory: category,
            quantity: stock,
            ressources: selectedResources.map((res) => ({
                idRessource: res.idRessource,
                quantity: res.quantity,
            })),
        };

        onSave(furnitureData);
        onOpenChange(false);
    };

    // Filtrer les ressources disponibles (non encore sélectionnées)
    const availableResources =
        resources?.filter(
            (resource) =>
                !selectedResources.some(
                    (selected) => selected.idRessource === resource._id
                )
        ) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                disabled={isCategoriesLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {!isCategoriesLoading &&
                                        !isCategoriesError &&
                                        categories?.map((cat) => (
                                            <SelectItem
                                                key={cat._id}
                                                value={cat._id}
                                            >
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    {isCategoriesLoading && (
                                        <SelectItem value="loading" disabled>
                                            Chargement...
                                        </SelectItem>
                                    )}
                                    {isCategoriesError && (
                                        <SelectItem value="error" disabled>
                                            Erreur de chargement
                                        </SelectItem>
                                    )}
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
                                            key={statusOption.value}
                                            value={statusOption.value}
                                        >
                                            {statusOption.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Section Ressources */}
                    <div className="space-y-4">
                        <Label>Ressources nécessaires</Label>

                        {/* Ressources sélectionnées */}
                        {selectedResources.length > 0 && (
                            <div className="space-y-2">
                                {selectedResources.map((resource) => (
                                    <div
                                        key={resource.idRessource}
                                        className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg"
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {resource.name}
                                        </Badge>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={resource.quantity}
                                            onChange={(e) =>
                                                handleResourceQuantityChange(
                                                    resource.idRessource,
                                                    parseInt(e.target.value) ||
                                                        1
                                                )
                                            }
                                            className="w-20 h-8"
                                        />
                                        <span className="text-sm text-gray-600">
                                            unités
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleResourceRemove(
                                                    resource.idRessource
                                                )
                                            }
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Ajouter une ressource */}
                        <div className="flex gap-2">
                            <Select
                                value={resourceToAdd}
                                onValueChange={setResourceToAdd}
                                disabled={
                                    isResourcesLoading ||
                                    availableResources.length === 0
                                }
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue
                                        placeholder={
                                            availableResources.length === 0
                                                ? "Toutes les ressources sont sélectionnées"
                                                : "Ajouter une ressource"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {!isResourcesLoading &&
                                        !isResourcesError &&
                                        availableResources.map((resource) => (
                                            <SelectItem
                                                key={resource._id}
                                                value={resource._id}
                                            >
                                                {resource.name}
                                            </SelectItem>
                                        ))}
                                    {isResourcesLoading && (
                                        <SelectItem
                                            value="resources-loading"
                                            disabled
                                        >
                                            Chargement des ressources...
                                        </SelectItem>
                                    )}
                                    {isResourcesError && (
                                        <SelectItem
                                            value="resources-error"
                                            disabled
                                        >
                                            Erreur de chargement des ressources
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                min="1"
                                value={resourceQuantity}
                                onChange={(e) =>
                                    setResourceQuantity(
                                        parseInt(e.target.value) || 1
                                    )
                                }
                                placeholder="Qté"
                                className="w-20"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleResourceAdd}
                                disabled={
                                    !resourceToAdd || resourceQuantity <= 0
                                }
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stock">Quantité</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={handleStockChange}
                            placeholder="1"
                        />
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
