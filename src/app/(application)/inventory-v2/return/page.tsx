import { ReturnReport } from "@/components/pages/inventory-v2/return";

export const metadata = {
    title: "Pengembalian Barang (Retur) | ERP Inventory",
    description: "Laporan pengembalian barang yang ditolak dari pengiriman atau transfer.",
};

export default function ReturnPage() {
    return <ReturnReport />;
}
