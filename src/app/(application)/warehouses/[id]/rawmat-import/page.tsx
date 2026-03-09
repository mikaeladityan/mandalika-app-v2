import { Suspense } from "react";
import { RawMaterialInventoryImportForm } from "@/components/pages/warehouse/rawmaterial/import";

export default function ImportRawMaterialInventoryPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <RawMaterialInventoryImportForm />
        </Suspense>
    );
}
