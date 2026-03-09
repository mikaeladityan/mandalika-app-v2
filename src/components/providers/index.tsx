"use client";

import { MakeQueryClient } from "@/lib/query";
import React, { useState } from "react";
import { Provider as JotaiProvider } from "jotai";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function RootProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(MakeQueryClient);
    return (
        <JotaiProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </JotaiProvider>
    );
}
