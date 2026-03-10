import { Suspense } from "react";
import { Units } from "@/components/pages/rawmat/unit";

export default function UnitPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Units />
        </Suspense>
    );
}
