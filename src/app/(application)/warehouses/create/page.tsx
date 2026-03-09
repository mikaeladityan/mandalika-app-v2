import { Suspense } from "react";
import { CreateWarehouse } from "@/components/pages/warehouse/create";

export default function CreateWarehousePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateWarehouse />
        </Suspense>
    );
}
