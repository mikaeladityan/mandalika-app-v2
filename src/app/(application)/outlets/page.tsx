import { Outlets } from "@/components/pages/outlets";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Outlet Management | Mandalika ERP",
    description: "Kelola lokasi toko dan koordinasi gudang utama untuk operasional POS.",
};

export default function Page() {
    return <Outlets />;
}
