import { GoodsReceipt } from "@/components/pages/inventory-v2/gr";
import { Suspense } from "react";

export default function GoodsReceiptPage() {
    return (
        <Suspense fallback={<div>Loading Goods Receipt Data...</div>}>
            <GoodsReceipt />
        </Suspense>
    );
}
