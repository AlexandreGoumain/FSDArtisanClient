import { z } from "zod";
import { mongoIdSchema } from "./common";
import { furnitureStatusSchema } from "./furnitures";

// Schema pour les filtres de recherche
export const searchFiltersSchema = z.object({
    search: z
        .string()
        .max(100, "La recherche ne peut pas dépasser 100 caractères")
        .optional(),
    category: mongoIdSchema.optional(),
    supplier: mongoIdSchema.optional(),
    status: furnitureStatusSchema.optional(),
    sortBy: z.enum(["name", "createdAt", "updatedAt", "quantity"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.number().min(1).max(1000).optional(),
    limit: z.number().min(1).max(100).optional(),
});

// =============================================================================
// 📤 TYPES INFÉRÉS
// =============================================================================

export type SearchFiltersData = z.infer<typeof searchFiltersSchema>;
