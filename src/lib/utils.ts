import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Hands the browser a mailto: (or other external) URL to open. */
export function openExternalUrl(url: string): void {
  window.location.assign(url);
}
