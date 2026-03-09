import { Suspense } from "react";
import { RawMatWarehouseStockDetail } from "@/components/pages/rawmat/stock/detail";

export default function RawMatWarehouseStockDetailPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <RawMatWarehouseStockDetail />
        </Suspense>
    );
}
