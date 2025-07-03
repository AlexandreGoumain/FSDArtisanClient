import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useFormValidation } from "../../../hooks/useValidation";
import {
    furnitureCreateSchema,
    type FurnitureCreateData,
} from "../../../schemas";

interface FurnitureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedFurniture: Furniture | null;
    onSave: (furnitureData: FurnitureCreate) => void;
    isLoading?: boolean;
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
    isLoading = false,
}: FurnitureModalProps) {
    const {
        data,
        errors,
        touched,
        isSubmitting,
        isValid,
        hasErrors,
        updateField,
        markFieldAsTouched,
        validateForm,
        handleSubmit,
        reset,
        setFieldError,
        setInitialData,
    } = useFormValidation<FurnitureCreateData>(furnitureCreateSchema);

    // État local pour la gestion des ressources (logique métier complexe)
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
            // Mode modification : pré-remplir les champs SANS déclencher de validation
            setInitialData({
                name: selectedFurniture.name,
                description: selectedFurniture.description,
                status: selectedFurniture.status as
                    | "waiting"
                    | "in_production"
                    | "ready_to_sell",
                idCategory: selectedFurniture.idCategory,
                quantity: selectedFurniture.quantity,
                ressources: selectedFurniture.ressources,
            });

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
            // Mode création : réinitialiser le formulaire
            reset();
            setSelectedResources([]);
        }
        setResourceToAdd("");
        setResourceQuantity(1);
    }, [selectedFurniture, open, isCreating, resources, setInitialData, reset]);

    // Synchroniser selectedResources avec le champ de validation
    useEffect(() => {
        const ressourcesForValidation = selectedResources.map((res) => ({
            idRessource: res.idRessource,
            quantity: res.quantity,
        }));
        updateField("ressources", ressourcesForValidation);
    }, [selectedResources, updateField]);

    // Handlers pour les champs de base
    const handleFieldChange =
        (field: keyof Pick<FurnitureCreateData, "name" | "description">) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            updateField(field, value);
            markFieldAsTouched(field);
        };

    const handleSelectChange =
        (field: keyof Pick<FurnitureCreateData, "idCategory" | "status">) =>
        (value: string) => {
            updateField(field, value);
            markFieldAsTouched(field);
        };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        updateField("quantity", value);
        markFieldAsTouched("quantity");
    };

    // Handler pour le blur (validation immédiate)
    const handleFieldBlur = (field: keyof FurnitureCreateData) => () => {
        markFieldAsTouched(field);
        validateForm();
    };

    // Gestion des ressources
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

        const newSelectedResources = [
            ...selectedResources,
            {
                idRessource: resourceToAdd,
                quantity: resourceQuantity,
                name: resourceName,
            },
        ];

        setSelectedResources(newSelectedResources);
        setResourceToAdd("");
        setResourceQuantity(1);
    };

    const handleResourceRemove = (idRessource: string) => {
        const newSelectedResources = selectedResources.filter(
            (res) => res.idRessource !== idRessource
        );
        setSelectedResources(newSelectedResources);
    };

    const handleResourceQuantityChange = (
        idRessource: string,
        newQuantity: number
    ) => {
        const updatedResources = selectedResources.map((res) =>
            res.idRessource === idRessource
                ? { ...res, quantity: newQuantity }
                : res
        );
        setSelectedResources(updatedResources);
    };

    // Handler pour la sauvegarde
    const handleSaveClick = async () => {
        // Marquer tous les champs comme touchés pour afficher les erreurs
        Object.keys(data).forEach((field) => {
            markFieldAsTouched(field as keyof FurnitureCreateData);
        });

        await handleSubmit(async (formData) => {
            try {
                const furnitureData: FurnitureCreate = {
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    idCategory: formData.idCategory,
                    quantity: formData.quantity,
                    ressources: formData.ressources,
                };

                await onSave(furnitureData);
                onOpenChange(false);
            } catch (error: unknown) {
                // Gérer les erreurs du serveur
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                if (errorMessage.includes("name")) {
                    setFieldError("name", "Ce nom de meuble est déjà utilisé");
                } else if (errorMessage.includes("category")) {
                    setFieldError("idCategory", "Catégorie invalide");
                } else if (errorMessage.includes("ressources")) {
                    setFieldError(
                        "ressources",
                        "Une ou plusieurs ressources sont invalides"
                    );
                } else {
                    console.error("Erreur lors de la sauvegarde:", error);
                }
            }
        });
    };

    // Handler pour fermer le modal
    const handleClose = () => {
        if (!isSubmitting && !isLoading) {
            onOpenChange(false);
            reset();
            setSelectedResources([]);
        }
    };

    // Filtrer les ressources disponibles (non encore sélectionnées)
    const availableResources =
        resources?.filter(
            (resource) =>
                !selectedResources.some(
                    (selected) => selected.idRessource === resource._id
                )
        ) || [];

    const submitDisabled =
        !isValid ||
        isSubmitting ||
        isLoading ||
        hasErrors ||
        selectedResources.length === 0;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter un meuble"
                            : "Modifier le meuble"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer un nouveau meuble dans le système"
                            : `Modification des informations de ${selectedFurniture?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveClick();
                    }}
                    className="space-y-4"
                >
                    {/* Nom du meuble */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nom du meuble
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name || ""}
                            onChange={handleFieldChange("name")}
                            onBlur={handleFieldBlur("name")}
                            placeholder="Ex: Canapé 3 places"
                            className={
                                errors.name && touched.name
                                    ? "border-destructive"
                                    : ""
                            }
                            disabled={isSubmitting || isLoading}
                        />
                        {errors.name && touched.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <textarea
                            id="description"
                            value={data.description || ""}
                            onChange={handleFieldChange("description")}
                            onBlur={handleFieldBlur("description")}
                            placeholder="Description détaillée du meuble..."
                            rows={3}
                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                errors.description && touched.description
                                    ? "border-destructive"
                                    : ""
                            }`}
                            disabled={isSubmitting || isLoading}
                        />
                        {errors.description && touched.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Catégorie et Statut */}
                    <div className="space-y-2 w-full flex flex-row gap-2 justify-between">
                        <div className="flex flex-col space-y-2 w-full">
                            <Label>
                                Catégorie
                                <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Select
                                value={data.idCategory || ""}
                                onValueChange={handleSelectChange("idCategory")}
                                disabled={
                                    isCategoriesLoading ||
                                    isSubmitting ||
                                    isLoading
                                }
                            >
                                <SelectTrigger
                                    className={
                                        errors.idCategory && touched.idCategory
                                            ? "border-destructive"
                                            : ""
                                    }
                                >
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
                            {errors.idCategory && touched.idCategory && (
                                <p className="text-sm text-destructive">
                                    {errors.idCategory}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                            <Label>
                                Statut
                                <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Select
                                value={data.status || ""}
                                onValueChange={handleSelectChange("status")}
                                disabled={isSubmitting || isLoading}
                            >
                                <SelectTrigger
                                    className={
                                        errors.status && touched.status
                                            ? "border-destructive"
                                            : ""
                                    }
                                >
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
                            {errors.status && touched.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Section Ressources */}
                    <div className="space-y-4">
                        <Label>
                            Ressources nécessaires
                            <span className="text-destructive ml-1">*</span>
                        </Label>

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
                                            disabled={isSubmitting || isLoading}
                                        />
                                        <span className="text-sm text-gray-600">
                                            unités
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleResourceRemove(
                                                    resource.idRessource
                                                )
                                            }
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            disabled={isSubmitting || isLoading}
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
                                    availableResources.length === 0 ||
                                    isSubmitting ||
                                    isLoading
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
                                disabled={isSubmitting || isLoading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleResourceAdd}
                                disabled={
                                    !resourceToAdd ||
                                    resourceQuantity <= 0 ||
                                    isSubmitting ||
                                    isLoading
                                }
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {errors.ressources && touched.ressources && (
                            <p className="text-sm text-destructive">
                                {errors.ressources}
                            </p>
                        )}
                        {selectedResources.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Au moins une ressource est requise pour créer un
                                meuble
                            </p>
                        )}
                    </div>

                    {/* Quantité */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            Quantité
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={data.quantity || ""}
                            onChange={handleQuantityChange}
                            onBlur={handleFieldBlur("quantity")}
                            placeholder="1"
                            className={
                                errors.quantity && touched.quantity
                                    ? "border-destructive"
                                    : ""
                            }
                            disabled={isSubmitting || isLoading}
                        />
                        {errors.quantity && touched.quantity && (
                            <p className="text-sm text-destructive">
                                {errors.quantity}
                            </p>
                        )}
                    </div>

                    {/* Affichage des erreurs générales */}
                    {hasErrors && Object.keys(touched).length > 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Veuillez corriger les erreurs ci-dessus avant de
                                continuer.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting || isLoading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={submitDisabled}>
                            {isSubmitting || isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    {isCreating
                                        ? "Création..."
                                        : "Sauvegarde..."}
                                </>
                            ) : isCreating ? (
                                "Créer"
                            ) : (
                                "Sauvegarder"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
