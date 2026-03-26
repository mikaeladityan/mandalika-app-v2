import { Suspense } from "react";
import { DetailProduct } from "@/components/pages/products/detail";

export default function DetailProductPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <DetailProduct />
        </Suspense>
    );
}
