"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { errorAtom } from "@/shared/store";

export function ErrorToastProvider() {
    const error = useAtomValue(errorAtom);

    useEffect(() => {
        if (!error.message && (!error.details || error.details.length === 0)) {
            return;
        }

        const content =
            error.details && error.details.length > 0 ? (
                <span className="space-y-1">
                    {error.details.map((err, idx) => (
                        <span key={idx} className="text-sm text-red-500">
                            <span className="font-medium text-red-500">[{err.path}]</span>{" "}
                            {err.message}
                        </span>
                    ))}
                </span>
            ) : (
                <span>{error.message}</span>
            );

        toast.error(<span className="text-rose-700 font-medium">Terjadi kesalahan</span>, {
            duration: 6000,
            className: "bg-red-50 text-red-500 border border-red-200",
            description: <p className="text-gray-500">{content}</p>,
        });
    }, [error]);

    return null;
}
