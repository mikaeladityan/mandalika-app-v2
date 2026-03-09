import { Suspense } from "react";
import { RecipeImportForm } from "@/components/pages/recipe/import";

export default function ImportRecipePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <RecipeImportForm />
        </Suspense>
    );
}
