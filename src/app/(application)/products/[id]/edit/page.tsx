import { Suspense } from "react";
import { EditProduct } from "@/components/pages/products/edit";

export default function EditProductPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditProduct />
        </Suspense>
    );
}
