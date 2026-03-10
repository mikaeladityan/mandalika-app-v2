import { Suppliers } from "@/components/pages/rawmat/supplier";
import { Suspense } from "react";

export default function SupplierPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Suppliers />
        </Suspense>
    );
}
