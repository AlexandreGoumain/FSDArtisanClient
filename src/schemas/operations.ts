import { z } from "zod";
import { mongoIdSchema } from "./common";

// Schema pour les opérations en lot
export const bulkDeleteSchema = z.object({
    ids: z
        .array(mongoIdSchema)
        .min(1, "Au moins un ID est requis")
        .max(50, "Maximum 50 éléments par opération"),
});

export const bulkUpdateSchema = z.object({
    ids: z
        .array(mongoIdSchema)
        .min(1, "Au moins un ID est requis")
        .max(50, "Maximum 50 éléments par opération"),
    updates: z.record(z.any()).optional(),
});

// =============================================================================
// 📤 TYPES INFÉRÉS
// =============================================================================

export type BulkDeleteData = z.infer<typeof bulkDeleteSchema>;
export type BulkUpdateData = z.infer<typeof bulkUpdateSchema>;
