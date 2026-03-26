import { authErrorAtom } from "@/shared/store";
import axios from "axios";
import { getDefaultStore } from "jotai";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

if (typeof window !== "undefined") {
    api.interceptors.request.use((config) => {
        const csrfToken = Cookies.get(process.env.NEXT_PUBLIC_XSRF_NAME!);

        if (csrfToken && config.headers) {
            config.headers[process.env.NEXT_PUBLIC_XSRF_HEADER_NAME!] = csrfToken;
        }

        return config;
    });

    const jotaiStore = getDefaultStore();
    api.interceptors.response.use(
        (res) => res,
        (err) => {
            const status = err.response?.status;

            if (status === 401) {
                jotaiStore.set(authErrorAtom, "UNAUTHORIZED");
            }

            if (status === 403) {
                jotaiStore.set(authErrorAtom, "FORBIDDEN");
            }

            if (status === 404) {
                jotaiStore.set(authErrorAtom, "NOT_FOUND");
            }

            return Promise.reject(err);
        }
    );
}

export async function setupCSRFToken() {
    try {
        await api.get("/csrf");
    } catch (error) {
        throw error;
    }
}
