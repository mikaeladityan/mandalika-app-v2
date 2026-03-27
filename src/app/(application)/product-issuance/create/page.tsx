import { Suspense } from "react";
import { CreateIssuance } from "@/components/pages/product-issuance/create";

export default function CreateIssuancePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Memuat Form Pengeluaran...</div>}>
            <CreateIssuance />
        </Suspense>
    );
}
