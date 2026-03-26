import { Suspense } from "react";
import { CreateUnit } from "@/components/pages/products/unit/form/create";

export default function CreateUnitPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateUnit />
        </Suspense>
    );
}
