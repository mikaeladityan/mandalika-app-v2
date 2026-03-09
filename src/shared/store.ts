import { atom } from "jotai";
import React from "react";

export interface ErrorState {
    message: string;
    details?: Array<{
        path?: string;
        message: string;
    }>;
}

export const errorAtom = atom<ErrorState>({
    message: "",
    details: [],
});

export const setErrorAtom = atom(null, (get, set, error: ErrorState) => {
    set(errorAtom, error);
});

export const notificationAtom = atom<{ title: string; message: string | React.ReactNode }>({
    title: "",
    message: "",
});

export const setNotificationAtom = atom(
    null,
    (get, set, notification: { title: string; message: string | React.ReactNode }) => {
        set(notificationAtom, notification);
    }
);

export type AuthErrorType = "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | null;

export const authErrorAtom = atom<AuthErrorType>(null);
