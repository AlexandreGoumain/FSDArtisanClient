import { useEffect } from "react";

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

import { useFormValidation } from "@/hooks/useValidation";
import { supplierCreateSchema, type SupplierCreateData } from "@/schemas";
import type { Supplier } from "@/store/api/types";
interface SupplierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedSupplier: Supplier | null;
    onSave: (supplierData: Partial<Supplier>) => void;
    isLoading?: boolean;
}

export function SupplierModal({
    open,
    onOpenChange,
    isCreating,
    selectedSupplier,
    onSave,
    isLoading = false,
}: SupplierModalProps) {
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
    } = useFormValidation<SupplierCreateData>(supplierCreateSchema);

    // Charger les informations du fournisseur (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedSupplier && open && !isCreating) {
            // Mode modification : pré-remplir les champs SANS déclencher de validation
            setInitialData({
                name: selectedSupplier.name,
                email: selectedSupplier.email,
                phone: selectedSupplier.phone,
            });
        } else if (open && isCreating) {
            // Mode création : réinitialiser le formulaire
            reset();
        }
    }, [selectedSupplier, open, isCreating, setInitialData, reset]);

    // Handler pour les changements de champs
    const handleFieldChange =
        (field: keyof SupplierCreateData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            updateField(field, value);

            // Marquer le champ comme touché pour afficher les erreurs
            markFieldAsTouched(field);
        };

    // Handler pour le blur (validation immédiate)
    const handleFieldBlur = (field: keyof SupplierCreateData) => () => {
        markFieldAsTouched(field);
        validateForm();
    };

    // Handler pour la sauvegarde
    const handleSaveClick = async () => {
        await handleSubmit(async (formData) => {
            try {
                await onSave(formData);
                onOpenChange(false);
            } catch (error: unknown) {
                // Gérer les erreurs du serveur
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                if (errorMessage.includes("email")) {
                    setFieldError("email", "Cet email est déjà utilisé");
                } else if (errorMessage.includes("name")) {
                    setFieldError("name", "Ce nom est déjà utilisé");
                } else {
                    // Erreur générale
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
        }
    };

    const submitDisabled = !isValid || isSubmitting || isLoading || hasErrors;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter un fournisseur"
                            : "Modifier le fournisseur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer un nouveau fournisseur dans le système"
                            : `Modification des informations de ${selectedSupplier?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveClick();
                    }}
                    className="space-y-4"
                >
                    {/* Nom du fournisseur */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nom du fournisseur
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name || ""}
                            onChange={handleFieldChange("name")}
                            onBlur={handleFieldBlur("name")}
                            placeholder="Ex: Mobilier Pro France"
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

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email || ""}
                            onChange={handleFieldChange("email")}
                            onBlur={handleFieldBlur("email")}
                            placeholder="contact@fournisseur.fr"
                            className={
                                errors.email && touched.email
                                    ? "border-destructive"
                                    : ""
                            }
                            disabled={isSubmitting || isLoading}
                        />
                        {errors.email && touched.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Téléphone
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={data.phone || ""}
                            onChange={handleFieldChange("phone")}
                            onBlur={handleFieldBlur("phone")}
                            placeholder="06 06 06 06 06"
                            className={
                                errors.phone && touched.phone
                                    ? "border-destructive"
                                    : ""
                            }
                            disabled={isSubmitting || isLoading}
                        />
                        {errors.phone && touched.phone && (
                            <p className="text-sm text-destructive">
                                {errors.phone}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Format accepté (ex: 06 06 06 06 06)
                        </p>
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
