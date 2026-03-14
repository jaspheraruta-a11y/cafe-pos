import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export function formatDate(d: string | Date): string {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(d));
}
