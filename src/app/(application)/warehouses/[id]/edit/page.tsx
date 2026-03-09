import { Suspense } from "react";
import { EditWarehouse } from "@/components/pages/warehouse/edit";

export default function EditWarehousePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditWarehouse />
        </Suspense>
    );
}
