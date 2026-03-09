import { Suspense } from "react";
import { CreateRawMaterial } from "@/components/pages/rawmat/create";

export default function CreateRawMatPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateRawMaterial />
        </Suspense>
    );
}
