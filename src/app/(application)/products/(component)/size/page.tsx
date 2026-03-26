import { Suspense } from "react";
import { ProductsSize } from "@/components/pages/products/size";

export default function SizePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductsSize />
        </Suspense>
    );
}
