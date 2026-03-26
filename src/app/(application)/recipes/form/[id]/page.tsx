import { Suspense } from "react";
import { FormRecipe } from "@/components/pages/recipe/form";

export default function EditRecipePage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <FormRecipe />
        </Suspense>
    );
}
