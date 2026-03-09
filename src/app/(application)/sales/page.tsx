import { Suspense } from "react";
import { Sales } from "@/components/pages/sales";

export default function SalesPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Sales />
        </Suspense>
    );
}
