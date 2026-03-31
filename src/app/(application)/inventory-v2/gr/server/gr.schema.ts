import { z } from "zod";

export const CreateGoodsReceiptItemSchema = z.object({
    product_id: z.coerce.number(),
    quantity_planned: z.coerce.number().min(0),
    quantity_actual: z.coerce.number().min(0),
    notes: z.string().optional(),
});

export const CreateGoodsReceiptSchema = z.object({
    warehouse_id: z.coerce.number(),
    date: z.string().min(1, "Tanggal harus diisi"),
    type: z.enum(["QC_FG", "MANUAL"]).default("MANUAL"),
    notes: z.string().optional(),
    items: z.array(CreateGoodsReceiptItemSchema).min(1),
});

export const QueryGoodsReceiptSchema = z.object({
    page: z.string().optional().transform(Number),
    take: z.string().optional().transform(Number),
    search: z.string().optional(),
    warehouse_id: z.string().transform(Number).optional(),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
});
export interface CreateGoodsReceiptDTO {
    warehouse_id: number;
    date: string;
    type: "QC_FG" | "MANUAL";
    notes?: string;
    items: {
        product_id: number;
        quantity_planned: number;
        quantity_actual: number;
        notes?: string;
    }[];
}
export type QueryGoodsReceiptDTO = z.infer<typeof QueryGoodsReceiptSchema>;

export interface GoodsReceiptDTO {
    id: number;
    gr_number: string;
    date: string;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    type: "QC_FG" | "MANUAL";
    warehouse_id: number;
    warehouse: { name: string };
    notes: string | null;
    items?: GoodsReceiptItemDTO[];
    _count?: { items: number };
    created_at: string;
}

export interface GoodsReceiptItemDTO {
    id: number;
    gr_id: number;
    product_id: number;
    product: { 
        name: string; 
        code: string;
        product_type?: { name: string };
        size?: { size: number };
    };
    label: string;
    quantity_planned: number;
    quantity_actual: number;
    notes: string | null;
}
