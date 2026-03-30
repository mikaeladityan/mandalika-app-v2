import { Suspense } from "react";
import { OutletImportForm } from "@/components/pages/outlets/import";

export default function OutletImportPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OutletImportForm />
        </Suspense>
    );
}
