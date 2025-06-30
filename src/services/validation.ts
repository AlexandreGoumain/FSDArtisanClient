import { z, type ZodSchema } from "zod";
import type { FormValidationResult, ValidationError } from "../types/auth";

export const validateWithZod = <T>(
    schema: ZodSchema<T>,
    data: unknown
): FormValidationResult<T> => {
    try {
        const validatedData = schema.parse(data);
        return {
            success: true,
            data: validatedData,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: ValidationError[] = error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));

            return {
                success: false,
                errors,
            };
        }

        return {
            success: false,
            errors: [
                { field: "unknown", message: "Erreur de validation inconnue" },
            ],
        };
    }
};

export const formatZodErrors = <T extends Record<string, unknown>>(
    zodError: z.ZodError
): Record<keyof T, string> => {
    const errors = {} as Record<keyof T, string>;

    zodError.errors.forEach((error) => {
        const field = error.path[0] as keyof T;
        if (field && !errors[field]) {
            errors[field] = error.message;
        }
    });

    return errors;
};
