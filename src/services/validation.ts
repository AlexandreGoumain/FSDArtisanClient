import { z } from "zod";

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
