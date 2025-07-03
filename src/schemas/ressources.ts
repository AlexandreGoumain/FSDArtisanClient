import { z } from "zod";
import { businessNameSchema, descriptionSchema, mongoIdSchema } from "./common";

// =============================================================================
// 🧱 RESSOURCES SCHEMAS
// =============================================================================

export const ressourceCreateSchema = z.object({
    name: businessNameSchema,
    description: descriptionSchema,
    idCategory: mongoIdSchema,
    idSupplier: mongoIdSchema,
});

export const ressourceUpdateSchema = ressourceCreateSchema.extend({
    _id: mongoIdSchema.optional(),
});

// =============================================================================
// 📤 TYPES INFÉRÉS
// =============================================================================

export type RessourceCreateData = z.infer<typeof ressourceCreateSchema>;
export type RessourceUpdateData = z.infer<typeof ressourceUpdateSchema>;
