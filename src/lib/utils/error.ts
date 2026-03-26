import { ErrorState } from "@/shared/store";
import React, { SetStateAction } from "react";
import { ApiError } from "./api.error";

export type ResponseError = {
    status: number;
    response: {
        data: {
            message: string;
            details?: Array<{ path: string; message: string }>;
        };
    };
};

export function FetchError(err: ResponseError, setErr: React.Dispatch<SetStateAction<ErrorState>>) {
    if (err instanceof ApiError) {
        if (err.status === 429) {
            setErr({
                message: "Anda terlalu sering melakukan permintaan, coba lagi seteleh 5 menit",
            });
            return;
        }
    } else {
        setErr({
            message: err.response.data.message || "An unexpected error occurred. Please try again.",
            details: err.response.data.details?.map((err) => ({
                path: err.path,
                message: err.message,
            })),
        });
    }
}
