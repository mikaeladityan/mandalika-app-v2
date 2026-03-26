import { Suspense } from "react";
import { RawMaterialInventoryImportForm } from "@/components/pages/rawmat/stock/import";

export default function ImportRawMaterialInventoryPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <RawMaterialInventoryImportForm />
        </Suspense>
    );
}
