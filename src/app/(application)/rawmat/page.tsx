import { Suspense } from "react";
import { RawMaterials } from "@/components/pages/rawmat";

export default function RawMatPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <RawMaterials />
        </Suspense>
    );
}
