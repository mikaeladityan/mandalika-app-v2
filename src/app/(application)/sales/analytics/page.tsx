import { Suspense } from "react";
import { SalesAnalytics } from "@/components/pages/sales/analytics";

export default function SalesAnalyticsPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <SalesAnalytics />
        </Suspense>
    );
}
