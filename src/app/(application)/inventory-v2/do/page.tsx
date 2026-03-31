import { DeliveryOrder } from "@/components/pages/inventory-v2/do";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "DO (Delivery Order) - Performence ERP",
    description: "Manajemen Delivery Order / Transfer Stok.",
};

export default function DOPage() {
    return <DeliveryOrder />;
}
