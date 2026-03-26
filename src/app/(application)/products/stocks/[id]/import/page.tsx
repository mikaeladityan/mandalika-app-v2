import { Suspense } from "react";
import { ProductInventoryImportForm } from "@/components/pages/products/stock/import";

export default function ImportProductInventoryPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ProductInventoryImportForm />
        </Suspense>
    );
}
