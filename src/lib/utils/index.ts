import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function ParseDate(data: Date) {
    const formatted = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(data));

    return formatted;
}

export function formatCurrency(
    value?: number | null,
    options?: {
        fallback?: string;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
    },
) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return options?.fallback ?? "—";
    }

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: options?.minimumFractionDigits ?? 0,
        maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    }).format(value);
}

export function formatNumber(value?: number | null) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatQuantity(value?: number | null, decimals = 2) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(value);
}
