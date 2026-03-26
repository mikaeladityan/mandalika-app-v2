import { Suspense } from "react";
import { ProductsUnit } from "@/components/pages/products/unit";

export default function UnitPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductsUnit />
        </Suspense>
    );
}
