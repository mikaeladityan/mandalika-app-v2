import { Suspense } from "react";
import { CreateProduct } from "@/components/pages/products/create";

export default function CreateProductPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateProduct />
        </Suspense>
    );
}
