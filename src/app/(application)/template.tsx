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
                <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex flex-col flex-1 min-w-0">
                        <Navbar />
                        <main className="flex-1 min-w-0 px-4 py-4">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </RequireAuth>
    );
}
