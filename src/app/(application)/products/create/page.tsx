import { Suspense } from "react";
import { CreateProduct } from "@/components/pages/products/form/create";

export default function CreateProductPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateProduct />
        </Suspense>
    );
}
