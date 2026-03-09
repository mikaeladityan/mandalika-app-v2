"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/app/auth/server/use.auth";

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            window.location.replace("/auth");
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) return null; // Tunggu check session
    if (!isAuthenticated) return null; // Jangan tampilkan konten sebelum redirect

    return <>{children}</>;
}
