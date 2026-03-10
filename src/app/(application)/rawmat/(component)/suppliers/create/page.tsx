import { Suspense } from "react";
import { CreateSupplier } from "@/components/pages/rawmat/supplier/form/create";

export default function CreateSupplierPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateSupplier />
        </Suspense>
    );
}
