import { Suspense } from "react";
import { CreateSales } from "@/components/pages/sales/create";

export default function CreateSalesPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateSales />
        </Suspense>
    );
}
