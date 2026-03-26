import { OpenPo } from "@/components/pages/po-open";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tracking PO Open",
    description: "Monitoring kedatangan material dan update status PO",
};

export default function Page() {
    return (
        <OpenPo
            title="Monitoring PO Open"
            description="Update nomor PO, estimasi kedatangan, dan status penerimaan material di sini."
        />
    );
}
