import { Suspense } from "react";
import { CreateSize } from "@/components/pages/products/size/form/create";

export default function CreateSizePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateSize />
        </Suspense>
    );
}
