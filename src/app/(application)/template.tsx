"use client";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { RequireAuth } from "@/components/auth/require.auth";

export default function ApplicationTemplate({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth>
            {/* <AuthBoundary /> */}
            <SidebarProvider>
                <div className="flex min-h-screen w-full overflow-hidden">
                    <AppSidebar />

                    <div className="flex flex-col flex-1 min-w-0 space-y-5">
                        <Navbar />
                        <main className="flex-1 min-w-0 overflow-hidden px-3 py-2">{children}</main>
                    </div>
                </div>
            </SidebarProvider>
        </RequireAuth>
    );
}
