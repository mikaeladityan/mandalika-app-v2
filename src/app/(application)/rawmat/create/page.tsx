import { Suspense } from "react";
import { CreateRawMaterial } from "@/components/pages/rawmat/crate";

export default function CreateRawMatPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateRawMaterial />
        </Suspense>
    );
}
