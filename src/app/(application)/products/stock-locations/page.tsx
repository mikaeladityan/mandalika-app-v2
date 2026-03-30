import { Suspense } from "react";
import { ProductStockLocation } from "@/components/pages/products/stock-location";

export default function ProductStockLocationPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductStockLocation />
        </Suspense>
    );
}
