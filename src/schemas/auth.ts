import { z } from "zod";

// 📧 Validation email avec Zod
export const emailSchema = z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères");

// 🔒 Validation mot de passe avec Zod
export const passwordSchema = z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    );

// 👤 Validation nom d'utilisateur
export const usernameSchema = z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères")
    .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores"
    );

// 🏷️ Validation nom/prénom
export const nameSchema = z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom contient des caractères invalides");

// 🔐 Schéma de connexion
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Le mot de passe est requis"),
});

// 📝 Schéma d'inscription
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    firstName: nameSchema,
    lastName: nameSchema,
});

// 👤 Schéma utilisateur
export const userSchema = z.object({
    email: emailSchema,
    username: usernameSchema,
    firstName: nameSchema,
    lastName: nameSchema,
});

// ✏️ Schéma mise à jour profil
export const updateProfileSchema = z
    .object({
        firstName: nameSchema.optional(),
        lastName: nameSchema.optional(),
        email: emailSchema.optional(),
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        "Au moins un champ doit être modifié"
    );

// 🔄 Schéma changement mot de passe
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, "La confirmation est requise"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

// 🔑 Schéma mot de passe oublié
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// 🔓 Schéma reset mot de passe
export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, "Le token est requis"),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "La confirmation est requise"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

// 📊 Export des types inférés
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserData = z.infer<typeof userSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
