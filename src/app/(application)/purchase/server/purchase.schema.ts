import { z } from "zod";

export const QueryPurchaseSchema = z.object({
    page: z.number().min(1).optional().default(1),
    take: z.number().min(1).optional().default(20),
    search: z.string().optional(),
    month: z.number().optional(),
    year: z.number().optional(),
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
    created_at: Date | string;
};
