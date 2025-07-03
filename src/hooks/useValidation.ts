import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z, type ZodSchema } from "zod";

import { formatZodErrors } from "@/services/validation";

// Hook pour debouncer les valeurs
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export const useFormValidation = <T extends Record<string, unknown>>(
    schema: ZodSchema<T>,
    initialData?: Partial<T>,
    options: { debounceMs?: number } = {}
) => {
    const { debounceMs = 500 } = options; // Augmenté pour réduire les validations fréquentes
    const [data, setData] = useState<Partial<T>>(initialData || {});
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
        {}
    );
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    // Debounce la validation en temps réel
    const debouncedData = useDebounce(data, debounceMs);
    const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Memoize le schema
    const memoizedSchema = useMemo(() => schema, [schema]);

    // Marquer comme initialisé après le premier rendu
    useEffect(() => {
        setIsInitialized(true);
    }, []);

    // 🆕 Fonction pour définir les données initiales sans déclencher de validation
    const setInitialData = useCallback((newData: Partial<T>) => {
        setIsInitializing(true);
        setData(newData);
        setErrors({});
        setTouched({});

        // Marquer la fin de l'initialisation après un petit délai
        setTimeout(() => {
            setIsInitializing(false);
        }, 50);
    }, []);

    const updateField = useCallback(
        (field: keyof T, value: unknown) => {
            setData((prev) => ({ ...prev, [field]: value }));

            // Marquer le champ comme touché seulement si ce n'est pas une initialisation
            // et si l'utilisateur interagit réellement
            if (
                !isInitializing &&
                value !== "" &&
                value !== null &&
                value !== undefined
            ) {
                setTouched((prev) => ({ ...prev, [field]: true }));
            }

            // Effacer l'erreur du champ seulement si elle existe déjà
            setErrors((prev) => {
                if (prev[field]) {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                }
                return prev;
            });
        },
        [isInitializing]
    );

    const markFieldAsTouched = useCallback(
        (field: keyof T) => {
            // Ne pas marquer comme touché pendant l'initialisation
            if (!isInitializing) {
                setTouched((prev) => ({ ...prev, [field]: true }));
            }
        },
        [isInitializing]
    );

    const validateForm = useCallback(() => {
        try {
            memoizedSchema.parse(data);
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
    }, [memoizedSchema, data]);

    // Validation automatique avec debounce améliorée
    useEffect(() => {
        // Ne pas valider si :
        // - Pas encore initialisé
        // - En cours d'initialisation
        // - Aucun champ touché
        if (
            !isInitialized ||
            isInitializing ||
            Object.keys(touched).length === 0
        ) {
            return;
        }

        // Nettoyer le timeout précédent
        if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
        }

        validationTimeoutRef.current = setTimeout(() => {
            try {
                memoizedSchema.parse(debouncedData);
                // Ne effacer que les erreurs des champs touchés qui sont maintenant valides
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    Object.keys(touched).forEach((key) => {
                        if (touched[key as keyof T]) {
                            delete newErrors[key as keyof T];
                        }
                    });
                    return newErrors;
                });
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const formattedErrors = formatZodErrors<T>(error);
                    // Mettre à jour seulement les erreurs des champs touchés
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(formattedErrors).forEach((key) => {
                            if (touched[key as keyof T]) {
                                newErrors[key as keyof T] =
                                    formattedErrors[key as keyof T];
                            }
                        });
                        return newErrors;
                    });
                }
            }
        }, 300); // Délai plus court pour la validation en temps réel

        return () => {
            if (validationTimeoutRef.current) {
                clearTimeout(validationTimeoutRef.current);
            }
        };
    }, [debouncedData, touched, memoizedSchema, isInitialized, isInitializing]);

    const handleSubmit = useCallback(
        async (onSubmit: (data: T) => Promise<void> | void) => {
            setIsSubmitting(true);

            try {
                // Marquer tous les champs comme touchés lors de la soumission
                const allFields = Object.keys(data) as (keyof T)[];
                setTouched(
                    allFields.reduce(
                        (acc, field) => ({ ...acc, [field]: true }),
                        {}
                    )
                );

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
        setIsInitializing(true);
        setData(initialData || {});
        setErrors({});
        setTouched({});
        setIsSubmitting(false);

        // Marquer la fin de l'initialisation après un petit délai
        setTimeout(() => {
            setIsInitializing(false);
        }, 50);
    }, [initialData]);

    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
        setTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    const clearFieldError = useCallback((field: keyof T) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);
    const isValid = useMemo(
        () => !hasErrors && Object.keys(data).length > 0,
        [hasErrors, data]
    );

    return {
        data,
        errors,
        touched,
        isSubmitting,
        isValid,
        hasErrors,
        isInitializing,
        updateField,
        markFieldAsTouched,
        validateForm,
        handleSubmit,
        reset,
        setFieldError,
        clearFieldError,
        setInitialData, // 🆕 Nouvelle fonction pour l'initialisation
    };
};

// 🚀 Hook spécialisé pour l'authentification
export const useAuthForm = <T extends Record<string, unknown>>(
    schema: ZodSchema<T>
) => {
    const form = useFormValidation(schema, undefined, { debounceMs: 800 });
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
