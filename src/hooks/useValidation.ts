import { useCallback, useState } from "react";
import { z, type ZodSchema } from "zod";
import { formatZodErrors } from "../services/validation";
import type { UseValidationResult } from "../types/auth";

export const useValidation = <T extends Record<string, unknown>>(
    schema: ZodSchema<T>
): UseValidationResult<T> => {
    const [errors, setErrors] = useState<Record<keyof T, string>>(
        {} as Record<keyof T, string>
    );

    const validate = useCallback(
        (data: T): boolean => {
            try {
                schema.parse(data);
                setErrors({} as Record<keyof T, string>);
                return true;
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const formattedErrors = formatZodErrors<T>(error);
                    setErrors(formattedErrors);
                    return false;
                }
                return false;
            }
        },
        [schema]
    );

    const clearErrors = useCallback(() => {
        setErrors({} as Record<keyof T, string>);
    }, []);

    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const isValid = Object.keys(errors).length === 0;

    return {
        errors,
        isValid,
        validate,
        clearErrors,
        setFieldError,
    };
};

export const useFormValidation = <T extends Record<string, unknown>>(
    schema: ZodSchema<T>,
    initialData?: Partial<T>
) => {
    const [data, setData] = useState<Partial<T>>(initialData || {});
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
        {}
    );

    const updateField = useCallback(
        (field: keyof T, value: unknown) => {
            setData((prev) => ({ ...prev, [field]: value }));

            // Effacer l'erreur du champ quand l'utilisateur tape
            if (errors[field]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        },
        [errors]
    );

    const markFieldAsTouched = useCallback((field: keyof T) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    const validateForm = useCallback(() => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = formatZodErrors<T>(error);
                setErrors(formattedErrors);
                return false;
            }
            return false;
        }
    }, [schema, data]);

    const handleSubmit = useCallback(
        async (onSubmit: (data: T) => Promise<void> | void) => {
            setIsSubmitting(true);

            try {
                const isValid = validateForm();

                if (isValid) {
                    await onSubmit(data as T);
                    // Reset form après soumission réussie
                    setData(initialData || {});
                    setErrors({});
                    setTouched({});
                }
            } catch (error) {
                console.error("Erreur lors de la soumission:", error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [data, validateForm, initialData]
    );

    const reset = useCallback(() => {
        setData(initialData || {});
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialData]);

    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const clearFieldError = useCallback((field: keyof T) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const hasErrors = Object.keys(errors).length > 0;
    const isValid = !hasErrors && Object.keys(data).length > 0;

    return {
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
        clearFieldError,
    };
};

// 🚀 Hook spécialisé pour l'authentification
export const useAuthForm = <T extends Record<string, unknown>>(
    schema: ZodSchema<T>
) => {
    const form = useFormValidation(schema);
    const [serverError, setServerError] = useState<string>("");

    const handleAuthSubmit = useCallback(
        async (
            onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
        ) => {
            setServerError("");

            await form.handleSubmit(async (data) => {
                const result = await onSubmit(data);

                if (!result.success && result.error) {
                    setServerError(result.error);
                }
            });
        },
        [form]
    );

    const clearServerError = useCallback(() => {
        setServerError("");
    }, []);

    return {
        ...form,
        serverError,
        handleAuthSubmit,
        clearServerError,
        hasAnyError: form.hasErrors || !!serverError,
    };
};
