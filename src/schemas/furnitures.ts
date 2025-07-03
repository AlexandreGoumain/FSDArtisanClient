import { z } from "zod";
import {
    businessNameSchema,
    descriptionSchema,
    mongoIdSchema,
    quantitySchema,
} from "./common";

// Status enum validation
export const furnitureStatusSchema = z.enum(
    ["waiting", "in_production", "ready_to_sell"],
    {
        message:
            "Le statut doit être 'waiting', 'in_production' ou 'ready_to_sell'",
    }
);

// Ressource pour furniture
export const furnitureRessourceSchema = z.object({
    idRessource: mongoIdSchema,
    quantity: quantitySchema,
    _id: mongoIdSchema.optional(),
});

export const furnitureCreateSchema = z.object({
    name: businessNameSchema,
    description: descriptionSchema,
    idCategory: mongoIdSchema,
    quantity: quantitySchema,
    status: furnitureStatusSchema,
    ressources: z
        .array(furnitureRessourceSchema)
        .min(1, "Au moins une ressource est requise")
        .max(20, "Maximum 20 ressources par meuble"),
});

export const furnitureUpdateSchema = furnitureCreateSchema.extend({
    _id: mongoIdSchema.optional(),
});

// =============================================================================
// 📤 TYPES INFÉRÉS
// =============================================================================

export type FurnitureCreateData = z.infer<typeof furnitureCreateSchema>;
export type FurnitureUpdateData = z.infer<typeof furnitureUpdateSchema>;
export type FurnitureRessourceData = z.infer<typeof furnitureRessourceSchema>;
export type FurnitureStatus = z.infer<typeof furnitureStatusSchema>;

// =============================================================================
// 🎯 VALIDATIONS PERSONNALISÉES
// =============================================================================

// Validation custom : vérifier que les ressources existent
export const createFurnitureWithValidRessourcesSchema = (
    availableRessourceIds: string[]
) =>
    furnitureCreateSchema.refine(
        (data) =>
            data.ressources.every((r) =>
                availableRessourceIds.includes(r.idRessource)
            ),
        {
            message: "Une ou plusieurs ressources sélectionnées n'existent pas",
            path: ["ressources"],
        }
    );
