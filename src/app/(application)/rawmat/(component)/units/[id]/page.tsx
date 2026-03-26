import { Suspense } from "react";
import { EditUnit } from "@/components/pages/rawmat/unit/form/edit";

export default function EditUnitPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditUnit />
        </Suspense>
    );
}
