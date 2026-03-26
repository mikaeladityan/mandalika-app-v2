import { Suspense } from "react";
import { EditSupplier } from "@/components/pages/rawmat/supplier/form/edit";

export default function EditCategoryPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditSupplier />
        </Suspense>
    );
}
