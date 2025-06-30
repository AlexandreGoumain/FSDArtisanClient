// Import des types inférés depuis les schémas Zod
import type { UserData } from "../schemas/auth";

export type {
    ChangePasswordData,
    ForgotPasswordData,
    UserData as IAuthUser,
    LoginFormData as LoginCredentials,
    RegisterFormData as RegisterData,
    ResetPasswordData,
    UpdateProfileData,
} from "../schemas/auth";

// Types de réponse API
export interface AuthResponse {
    user: UserData;
    message?: string;
}

// Types d'erreur de validation
export interface ValidationError {
    field: string;
    message: string;
}

export interface FormValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
}

// Types pour les hooks de validation
export interface UseValidationResult<T> {
    errors: Record<keyof T, string>;
    isValid: boolean;
    validate: (data: T) => boolean;
    clearErrors: () => void;
    setFieldError: (field: keyof T, message: string) => void;
}
