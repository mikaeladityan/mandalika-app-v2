import { Suspense } from "react";
import { Recipe } from "@/components/pages/recipe";

export default function RecipePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Recipe />
        </Suspense>
    );
}
