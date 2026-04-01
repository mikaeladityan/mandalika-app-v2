import { DiscrepancyReport } from "@/components/pages/inventory-v2/discrepancy";

export const metadata = {
    title: "Laporan Selisih (Discrepancy) - ERP",
    description: "Audit barang hilang atau ditolak pada DO & Transfer Gudang",
};

export default function DiscrepancyPage() {
    return <DiscrepancyReport />;
}
