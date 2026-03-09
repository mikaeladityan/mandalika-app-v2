import { Suspense } from "react";
import { Products } from "@/components/pages/products";

export default function ProductPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Products />
        </Suspense>
    );
}
