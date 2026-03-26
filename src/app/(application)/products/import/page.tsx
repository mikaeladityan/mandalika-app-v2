import { Suspense } from "react";
import { ImportForm } from "@/components/pages/products/import";

export default function ImportProductPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ImportForm />
        </Suspense>
    );
}
