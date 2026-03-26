"use client";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequestDTO, RegisterRequestDTO } from "./schema";
import { AuthService } from "./services";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { RoleEnumDTO } from "@/shared/types";

// Hook sederhana untuk mengambil data user
export function useAuthAccount() {
    return useQuery({
        queryKey: ["account"],
        queryFn: AuthService.getAccount,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

// ✅ PERBAIKAN: Gunakan fungsi cek yang tepat
export function useAuth() {
    const { data, isLoading } = useAuthAccount();

    return {
        account: data,
        isLoading,
        isAuthenticated: !!data,
    };
}

// ✅ PERBAIKAN: Update juga useRole
export function useRole(allowedRoles: RoleEnumDTO[]) {
    const { account, isLoading, isAuthenticated } = useAuth();

    const hasRole = !!account && allowedRoles.includes(account.role);

    return {
        role: account?.role,
        hasRole,
        isAuthenticated,
        isLoading,

        // semantic helpers
        isAuthorized: isAuthenticated && hasRole,
        isForbidden: isAuthenticated && !hasRole,
    };
}

export function useFormAuth() {
    const setErr = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const register = useMutation<unknown, ResponseError, RegisterRequestDTO>({
        mutationKey: ["register"],
        mutationFn: (body) => AuthService.register(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            setNotification({ title: "Register", message: "Selamat anda berhasil membuat akun" });
            window.location.replace("/auth");
        },
    });

    const login = useMutation<unknown, ResponseError, LoginRequestDTO>({
        mutationKey: ["login"],
        mutationFn: (body) => AuthService.login(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            window.location.replace("/");
            queryClient.invalidateQueries({ queryKey: ["account"], type: "all" });
        },
    });

    const logout = useMutation<unknown, ResponseError>({
        mutationKey: ["logout"],
        mutationFn: AuthService.logout,
        onSuccess: () => {
            window.location.href = "/auth";
            queryClient.invalidateQueries({ queryKey: ["account"], type: "all" });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    return {
        register: register.mutateAsync,
        login: login.mutateAsync,
        logout: logout.mutateAsync,
        isPending: register.isPending || login.isPending || logout.isPending,
    };
}

// Contoh penggunaan useRole
// PAGE
// const { isAuthorized, isForbidden, isLoading } = useRole(["ADMIN"]);

// if (isLoading) return <Loading />;

// if (isForbidden) {
//     throw new Error("FORBIDDEN");
// }

// return <AdminPage />;

// UI
// const { hasRole } = useRole(["OWNER"]);

// <Button disabled={!hasRole}>Delete</Button>;
