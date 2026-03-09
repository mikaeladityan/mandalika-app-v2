import { Purchase } from "@/components/pages/purchase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Daftar Purchase Order",
    description: "Kumpulan pengajuan draft PO material",
};

export default function Page() {
    return (
        <Purchase
            title="Daftar Pengajuan Purchase"
            description="Lakukan export kumpulan material yang berstatus draft ke Excel."
        />
    );
}
