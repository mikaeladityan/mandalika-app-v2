import { Suspense } from "react";
import { ImportRawmatForm } from "@/components/pages/rawmat/import";

export default function ImportRawmatPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <ImportRawmatForm />
        </Suspense>
    );
}
