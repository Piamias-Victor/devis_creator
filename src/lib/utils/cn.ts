import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitaire pour fusionner les classes Tailwind
 * Évite les conflits et optimise les classes CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}