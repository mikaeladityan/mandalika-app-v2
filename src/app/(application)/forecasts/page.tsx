import { Forecast } from "@/components/pages/forecast";
import { Suspense } from "react";

export default function ForecastPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Forecast />
        </Suspense>
    );
}
