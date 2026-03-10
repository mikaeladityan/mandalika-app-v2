import { Suspense } from "react";
import { Categories } from "@/components/pages/rawmat/category";

export default function CategoriesPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <Categories />
        </Suspense>
    );
}
