import { Suspense } from "react";
import { Main } from "@/components/pages/main";

export default function Home() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Main />
        </Suspense>
    );
}
