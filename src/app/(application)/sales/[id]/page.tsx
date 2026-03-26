import { Suspense } from "react";
import { EditSales } from "@/components/pages/sales/edit";

export default function CreateSalesPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditSales />
        </Suspense>
    );
}
