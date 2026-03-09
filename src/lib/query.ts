import { QueryClient } from "@tanstack/react-query";

export function MakeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: (failureCount, error: any) => {
                    // Jangan retry untuk 401/403 errors
                    if ([401, 403].includes(error?.status)) return false;
                    return failureCount < 2;
                },
                staleTime: 15 * 60 * 1000,
                gcTime: 5 * 60 * 1000,
            },
        },
    });
}
