import { z } from "zod";

export const QueryPurchaseSchema = z.object({
    page: z.number().min(1).optional().default(1),
    take: z.number().min(1).optional().default(20),
    search: z.string().optional(),
    month: z.number().optional(),
    year: z.number().optional(),
    supplier_id: z.number().optional(),
});

export type QueryPurchaseDTO = z.infer<typeof QueryPurchaseSchema>;

export type PurchaseResponse = {
    recommendation_id: number;
    material_id: number;
    barcode: string;
    material_name: string;
    supplier_name: string;
    quantity: number;
    uom: string;
    price: number;
    moq: number | null;
    pic_id: string | null;
    status: string;
    created_at: Date | string;
};

export type PurchaseSummaryResponse = {
    supplier_id: number;
    supplier_name: string;
    total_amount: number;
    total_items: number;
    items: Array<{
        material_name: string;
        barcode: string;
        quantity: number;
        price: number;
        subtotal: number;
        uom: string;
        status: string;
    }>;
};
