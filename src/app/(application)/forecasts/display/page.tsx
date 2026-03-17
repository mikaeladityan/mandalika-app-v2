import { Forecast } from "@/components/pages/forecast";
import { Suspense } from "react";

export default function ForecastDisplayPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Forecast is_display={true} />
        </Suspense>
    );
}
