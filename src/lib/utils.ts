import { clsx, type ClassValue } from "clsx";
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
