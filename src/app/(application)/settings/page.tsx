import { Metadata } from "next";
import { Suspense } from "react";
import { SettingsPage } from "@/components/pages/settings";

export const metadata: Metadata = { title: "Pengaturan" };

export default function Page() {
    return (
        <Suspense>
            <SettingsPage />
        </Suspense>
    );
}
