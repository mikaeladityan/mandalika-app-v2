import { Consolidation } from "@/components/pages/consolidation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konsolidasi Pesanan",
    description: "Kumpulan pengajuan draft PO material dari rekomendasi",
};

export default function Page() {
    return (
        <Consolidation
            title="Konsolidasi Pesanan"
            description="Lakukan export & tinjau kumpulan material yang berstatus draft ke Excel."
        />
    );
}
