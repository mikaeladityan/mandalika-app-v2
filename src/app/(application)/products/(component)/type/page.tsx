import { Suspense } from "react";
import { ProductsType } from "@/components/pages/products/type";

export default function TypePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductsType />
        </Suspense>
    );
}
