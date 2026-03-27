import { Suspense } from "react";
import { EditIssuance } from "@/components/pages/product-issuance/edit";

export default function EditIssuancePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Memuat Form Edit...</div>}>
            <EditIssuance />
        </Suspense>
    );
}
