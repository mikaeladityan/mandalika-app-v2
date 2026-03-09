import { Suspense } from "react";
import { Warehouse } from "@/components/pages/warehouse";

export default function WarehousePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Warehouse />
        </Suspense>
    );
}
