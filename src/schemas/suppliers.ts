import { z } from "zod";
import {
    businessEmailSchema,
    businessNameSchema,
    mongoIdSchema,
    phoneSchema,
} from "./common";

// =============================================================================
// 🏢 SUPPLIERS SCHEMAS
// =============================================================================

export const supplierCreateSchema = z.object({
    name: businessNameSchema,
    email: businessEmailSchema,
    phone: phoneSchema,
});

export const supplierUpdateSchema = supplierCreateSchema.extend({
    _id: mongoIdSchema.optional(),
});

// =============================================================================
// 📤 TYPES INFÉRÉS
// =============================================================================

export type SupplierCreateData = z.infer<typeof supplierCreateSchema>;
export type SupplierUpdateData = z.infer<typeof supplierUpdateSchema>;

// =============================================================================
// 🎯 VALIDATIONS PERSONNALISÉES
// =============================================================================

// Validation custom : vérifier que le nom du supplier est unique
export const createSupplierWithUniqueNameSchema = (existingNames: string[]) =>
    supplierCreateSchema.refine(
        (data) => !existingNames.includes(data.name.toLowerCase()),
        {
            message: "Un fournisseur avec ce nom existe déjà",
            path: ["name"],
        }
    );

// Validation custom : vérifier que l'email du supplier est unique
export const createSupplierWithUniqueEmailSchema = (existingEmails: string[]) =>
    supplierCreateSchema.refine(
        (data) => !existingEmails.includes(data.email.toLowerCase()),
        {
            message: "Un fournisseur avec cet email existe déjà",
            path: ["email"],
        }
    );
