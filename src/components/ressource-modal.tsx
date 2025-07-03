import React, { useCallback, useEffect, useMemo } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useGetAllRessourcesCategoriesQuery,
    useGetAllSuppliersQuery,
} from "@/store/api";
import type { Ressource } from "@/store/api/types";

import { useFormValidation } from "@/hooks/useValidation";
import { ressourceCreateSchema, type RessourceCreateData } from "@/schemas";

interface RessourceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedRessource: Ressource | null;
    onSave: (ressourceData: Partial<Ressource>) => void;
    isLoading?: boolean;
}

export const RessourceModal = React.memo(function RessourceModal({
    open,
    onOpenChange,
    isCreating,
    selectedRessource,
    onSave,
    isLoading = false,
}: RessourceModalProps) {
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
    } = useFormValidation<RessourceCreateData>(ressourceCreateSchema);

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

    // Memoize computed values
    const submitDisabled = useMemo(
        () => !isValid || isSubmitting || isLoading || hasErrors,
        [isValid, isSubmitting, isLoading, hasErrors]
    );

    // Charger les informations de la ressource (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedRessource && open && !isCreating) {
            setInitialData({
                name: selectedRessource.name,
                description: selectedRessource.description,
                idCategory: selectedRessource.idCategory,
                idSupplier: selectedRessource.idSupplier,
            });
        } else if (open && isCreating) {
            // Mode création : réinitialiser le formulaire
            reset();
        }
    }, [selectedRessource, open, isCreating, setInitialData, reset]);

    // Handler pour les changements de champs texte (memoized)
    const handleFieldChange = useCallback(
        (field: keyof Pick<RessourceCreateData, "name" | "description">) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                updateField(field, value);
                markFieldAsTouched(field);
            },
        [updateField, markFieldAsTouched]
    );

    // Handler pour les selects (memoized)
    const handleSelectChange = useCallback(
        (field: keyof Pick<RessourceCreateData, "idCategory" | "idSupplier">) =>
            (value: string) => {
                updateField(field, value);
                markFieldAsTouched(field);
            },
        [updateField, markFieldAsTouched]
    );

    // Handler pour le blur (validation immédiate) (memoized)
    const handleFieldBlur = useCallback(
        (field: keyof RessourceCreateData) => () => {
            markFieldAsTouched(field);
            validateForm();
        },
        [markFieldAsTouched, validateForm]
    );

    // Handler pour la sauvegarde (memoized)
    const handleSaveClick = useCallback(async () => {
        await handleSubmit(async (formData) => {
            try {
                await onSave(formData);
                onOpenChange(false);
            } catch (error: unknown) {
                // Gérer les erreurs du serveur
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                if (errorMessage.includes("name")) {
                    setFieldError(
                        "name",
                        "Ce nom de ressource est déjà utilisé"
                    );
                } else if (errorMessage.includes("category")) {
                    setFieldError("idCategory", "Catégorie invalide");
                } else if (errorMessage.includes("supplier")) {
                    setFieldError("idSupplier", "Fournisseur invalide");
                } else {
                    console.error("Erreur lors de la sauvegarde:", error);
                }
            }
        });
    }, [handleSubmit, onSave, onOpenChange, setFieldError]);

    // Handler pour fermer le modal (memoized)
    const handleClose = useCallback(() => {
        if (!isSubmitting && !isLoading) {
            onOpenChange(false);
            reset();
        }
    }, [isSubmitting, isLoading, onOpenChange, reset]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter une ressource"
                            : "Modifier la ressource"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer une nouvelle ressource dans le système"
                            : `Modification des informations de ${selectedRessource?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveClick();
                    }}
                    className="space-y-4"
                >
                    {/* Nom de la ressource */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nom de la ressource
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name || ""}
                            onChange={handleFieldChange("name")}
                            onBlur={handleFieldBlur("name")}
                            placeholder="Ex: Planches de chêne"
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
                        <Input
                            id="description"
                            value={data.description || ""}
                            onChange={handleFieldChange("description")}
                            onBlur={handleFieldBlur("description")}
                            placeholder="Ex: Planches de chêne massif de 2m à 4m"
                            className={
                                errors.description && touched.description
                                    ? "border-destructive"
                                    : ""
                            }
                            disabled={isSubmitting || isLoading}
                        />
                        {errors.description && touched.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                        <Label>
                            Catégorie
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Select
                            value={data.idCategory || ""}
                            onValueChange={handleSelectChange("idCategory")}
                            disabled={
                                isCategoriesLoading || isSubmitting || isLoading
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
                        {errors.idCategory && touched.idCategory && (
                            <p className="text-sm text-destructive">
                                {errors.idCategory}
                            </p>
                        )}
                    </div>

                    {/* Fournisseur */}
                    <div className="space-y-2">
                        <Label>
                            Fournisseur
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Select
                            value={data.idSupplier || ""}
                            onValueChange={handleSelectChange("idSupplier")}
                            disabled={
                                isSuppliersLoading || isSubmitting || isLoading
                            }
                        >
                            <SelectTrigger
                                className={
                                    errors.idSupplier && touched.idSupplier
                                        ? "border-destructive"
                                        : ""
                                }
                            >
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
                        {errors.idSupplier && touched.idSupplier && (
                            <p className="text-sm text-destructive">
                                {errors.idSupplier}
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
});
