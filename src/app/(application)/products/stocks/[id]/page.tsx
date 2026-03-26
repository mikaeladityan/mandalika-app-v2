import { Suspense } from "react";
import { ProductsWarehouseStockDetail } from "@/components/pages/products/stock/detail";

export default function ProductsWarehouseStockDetailPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductsWarehouseStockDetail />
        </Suspense>
    );
}
