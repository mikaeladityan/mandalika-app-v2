import { Suspense } from "react";
import { ImportSalesForm } from "@/components/pages/sales/import";

export default function ImportSalesPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ImportSalesForm />
        </Suspense>
    );
}
