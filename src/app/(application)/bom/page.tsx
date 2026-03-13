import BOMPage from "@/components/pages/bom";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bill of Materials (BOM) | ERP eLibrary",
    description: "Manajemen kebutuhan bahan baku dan analisis forecast produk.",
};

export default function Page() {
    return <BOMPage />;
}
