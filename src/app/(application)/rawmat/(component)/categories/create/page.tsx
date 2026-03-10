import { Suspense } from "react";
import { CreateCategory } from "@/components/pages/rawmat/category/form/create";

export default function CreateCategoryPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <CreateCategory />
        </Suspense>
    );
}
