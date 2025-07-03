// Import des types inférés depuis les schémas Zod
import type { UserData } from "@/schemas/auth";

export type {
    ChangePasswordData,
    ForgotPasswordData,
    UserData as IAuthUser,
    LoginFormData as LoginCredentials,
    RegisterFormData as RegisterData,
    ResetPasswordData,
    UpdateProfileData,
} from "@/schemas/auth";

// Types de réponse API
export interface AuthResponse {
    user: UserData;
    message?: string;
}
