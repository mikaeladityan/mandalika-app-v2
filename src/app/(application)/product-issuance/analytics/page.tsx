import { Suspense } from "react";
import { IssuanceAnalytics } from "@/components/pages/product-issuance/analytics";

export default function IssuanceAnalyticsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Memuat Analitik...</div>}>
            <IssuanceAnalytics />
        </Suspense>
    );
}
