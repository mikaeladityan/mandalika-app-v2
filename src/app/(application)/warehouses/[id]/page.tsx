import { Suspense } from "react";
import { DetailWarehouse } from "@/components/pages/warehouse/detail";

export default function DetailWarehousePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <DetailWarehouse />
        </Suspense>
    );
}
