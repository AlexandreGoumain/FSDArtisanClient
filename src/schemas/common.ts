import { z } from "zod";

// 📧 Validation email générique
export const businessEmailSchema = z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères");

// 📞 Validation téléphone français
export const phoneSchema = z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(
        /^(?:\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/,
        "Format de téléphone invalide (ex: 06 06 06 06 06)"
    );

// 🏷️ Validation nom générique
export const businessNameSchema = z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .trim();

// 📝 Validation description
export const descriptionSchema = z
    .string()
    .min(3, "La description doit contenir au moins 3 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .trim();

// 🆔 Validation ID MongoDB
export const mongoIdSchema = z
    .string()
    .min(1, "L'ID est requis")
    .regex(/^[0-9a-fA-F]{24}$/, "Format d'ID invalide");

// 🔢 Validation quantité
export const quantitySchema = z
    .number()
    .min(1, "La quantité doit être supérieure à 0")
    .max(10000, "La quantité ne peut pas dépasser 10000")
    .int("La quantité doit être un nombre entier");
