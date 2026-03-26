import { Suspense } from "react";
import { EditRawmat } from "@/components/pages/rawmat/edit";

export default function UpdateRawMat() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditRawmat />
        </Suspense>
    );
}
