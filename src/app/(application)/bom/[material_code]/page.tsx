import { Suspense } from "react";
import DetailBOMRequirement from "@/components/pages/bom/detail";

export default function DetailBOMRequirementPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <DetailBOMRequirement />
        </Suspense>
    );
}
