import { Suspense } from "react";
import { CreateType } from "@/components/pages/products/type/form/create";

export default function CreateTypePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateType />
        </Suspense>
    );
}
