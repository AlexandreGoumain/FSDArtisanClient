import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDifferencePercentageByPeriod(
    pastValue: number,
    currentValue: number
) {
    const difference = currentValue - pastValue;
    const percentage = Math.round((difference / pastValue) * 100);
    return {
        difference,
        percentage,
    };
}

export type FurnitureStatusValue =
    | "waiting"
    | "in_production"
    | "ready_to_sell";

export const FURNITURE_STATUS_TRANSLATIONS: Record<
    FurnitureStatusValue,
    string
> = {
    waiting: "En attente",
    in_production: "En production",
    ready_to_sell: "Prêt à vendre",
} as const;

export const FURNITURE_STATUS_OPTIONS = Object.entries(
    FURNITURE_STATUS_TRANSLATIONS
).map(([value, label]) => ({ value: value as FurnitureStatusValue, label }));

export function translateFurnitureStatus(status: FurnitureStatusValue): string {
    return FURNITURE_STATUS_TRANSLATIONS[status] || status;
}

export function getFurnitureStatusBadgeVariant(
    status: FurnitureStatusValue
): "default" | "secondary" {
    return status === "ready_to_sell" ? "default" : "secondary";
}

export function getFurnitureStatusBadgeClassName(
    status: FurnitureStatusValue
): string {
    switch (status) {
        case "ready_to_sell":
            return "bg-green-100 text-green-800";
        case "in_production":
            return "bg-yellow-100 text-yellow-800";
        case "waiting":
        default:
            return "bg-gray-100 text-gray-800";
    }
}
