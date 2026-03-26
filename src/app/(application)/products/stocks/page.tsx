import { Suspense } from "react";
import { ProductsStock } from "@/components/pages/products/stock";

export default function ProductStockPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductsStock />
        </Suspense>
    );
}
