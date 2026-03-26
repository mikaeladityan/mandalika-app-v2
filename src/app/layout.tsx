import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { ErrorToastProvider } from "@/components/providers/error";
import { NotificationToastProvider } from "@/components/providers/notification";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Mandalika ERP",
        template: "%s | Mandalika ERP",
    },
    description: "Sistem ERP Mandalika Parfumery - Manajemen Produk, Penjualan, dan Gudang",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.className} antialiased`}>
                <RootProvider>
                    {children}
                    <Toaster position="top-right" closeButton />
                    <ErrorToastProvider />
                    <NotificationToastProvider />
                </RootProvider>
            </body>
        </html>
    );
}
