import { Suspense } from "react";
import { CreateUnit } from "@/components/pages/rawmat/unit/form/create";

export default function CreateUnitPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateUnit />
        </Suspense>
    );
}
