import { BOMManagement } from "@/components/pages/bom";
import { Suspense } from "react";

export default function BOMpage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BOMManagement />
        </Suspense>
    );
}
