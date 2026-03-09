"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { authErrorAtom, errorAtom } from "@/shared/store";

export function AuthBoundary() {
    const [authError, setAuthError] = useAtom(authErrorAtom);
    const setError = useAtom(errorAtom)[1];

    useEffect(() => {
        if (!authError) return;

        switch (authError) {
            case "UNAUTHORIZED":
                setAuthError(null);
                window.location.replace("/auth");
                break;

            case "FORBIDDEN":
                setError({ message: "You don't have permission to access this page" });
                setAuthError(null);
                window.location.replace("/auth");
                break;

            case "NOT_FOUND":
                setAuthError(null);
                window.location.replace("/404");
                break;
        }
    }, [authError, setAuthError, setError]);

    return null;
}
