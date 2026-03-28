import { ConsolidationSupplier } from "@/components/pages/consolidation/supplier-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konsolidasi Per Supplier",
    description: "Kelola dan cetak form permintaan barang per supplier",
};

export default function Page() {
    return (
        <ConsolidationSupplier
            title="Konsolidasi Per Supplier"
            description="Kelola material request yang dikelompokkan per supplier. Cetak Form Permintaan Barang (FPB) langsung."
        />
    );
}
