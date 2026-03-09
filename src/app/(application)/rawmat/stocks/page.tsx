import { Suspense } from "react";
import { RawMatStock } from "@/components/pages/rawmat/stock";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stock Raw Material | ERP Mandalika",
    description: "Halaman Stock Raw Material ERP Mandalika",
};

export default function RawMatStockPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <RawMatStock />
        </Suspense>
    );
}
