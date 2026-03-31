import { z } from "zod";

export const RequestGoodsReceiptItemSchema = z.object({
    product_id: z.coerce.number(),
    quantity_planned: z.coerce.number().min(0),
    quantity_actual: z.coerce.number().min(0),
    notes: z.string().optional(),
});

export const RequestGoodsReceiptSchema = z.object({
    warehouse_id: z.coerce.number(),
    date: z.string().min(1, "Tanggal harus diisi"),
    type: z.enum(["QC_FG", "MANUAL"]).default("MANUAL"),
    notes: z.string().optional(),
    items: z.array(RequestGoodsReceiptItemSchema).min(1),
});

export const QueryGoodsReceiptSchema = z.object({
    page: z.string().optional().transform(Number),
    take: z.string().optional().transform(Number),
    search: z.string().optional(),
    warehouse_id: z.string().transform(Number).optional(),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
    type: z.enum(["QC_FG", "MANUAL"]).optional(),
});

export const ResponseGoodsReceiptItemSchema = z.object({
    id: z.number(),
    gr_id: z.number(),
    product_id: z.number(),
    product: z.object({
        name: z.string(),
        code: z.string(),
        product_type: z.object({ name: z.string() }).optional(),
        size: z.object({ size: z.number() }).optional(),
    }),
    label: z.string(),
    quantity_planned: z.number(),
    quantity_actual: z.number(),
    notes: z.string().nullable(),
});

export const ResponseGoodsReceiptSchema = z.object({
    id: z.number(),
    gr_number: z.string(),
    date: z.string(),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
    type: z.enum(["QC_FG", "MANUAL"]),
    warehouse_id: z.number(),
    warehouse: z.object({ name: z.string() }),
    notes: z.string().nullable(),
    items: z.array(ResponseGoodsReceiptItemSchema).optional(),
    _count: z.object({ items: z.number() }).optional(),
    created_at: z.string(),
});

export type RequestGoodsReceiptDTO = z.input<typeof RequestGoodsReceiptSchema>;
export type ResponseGoodsReceiptDTO = z.infer<typeof ResponseGoodsReceiptSchema>;
export type ResponseGoodsReceiptItemDTO = z.infer<typeof ResponseGoodsReceiptItemSchema>;
export type QueryGoodsReceiptDTO = z.infer<typeof QueryGoodsReceiptSchema>;
