import { Suspense } from "react";
import { EditCategory } from "@/components/pages/rawmat/category/form/edit";

export default function EditCategoryPage() {
    return (
        <Suspense fallback={<div>Loading data...</div>}>
            <EditCategory />
        </Suspense>
    );
}
