import { z } from "zod";

export const ResponseReturnSchema = z.object({
    id: z.number(),
    return_number: z.string(),
    from_type: z.string(),
    from_warehouse_id: z.number().nullable(),
    from_outlet_id: z.number().nullable(),
    to_type: z.string(),
    to_warehouse_id: z.number().nullable(),
    to_outlet_id: z.number().nullable(),
    status: z.string(),
    notes: z.string().nullable(),
    source_transfer_id: z.number().nullable(),
    created_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    shipped_at: z.string().nullable(),
    received_at: z.string().nullable(),
    items: z.array(z.object({
        id: z.number(),
        product_id: z.number(),
        quantity: z.coerce.number(),
        notes: z.string().nullable(),
        product: z.object({
            id: z.number(),
            code: z.string(),
            name: z.string(),
            product_type: z.object({ name: z.string() }).optional(),
            size: z.object({ size: z.string() }).optional(),
            unit: z.object({ name: z.string() }).optional(),
            gender: z.string().optional(),
        }).optional(),
    })).optional(),
    from_warehouse: z.object({ name: z.string() }).optional().nullable(),
    from_outlet: z.object({ name: z.string() }).optional().nullable(),
    to_warehouse: z.object({ name: z.string() }).optional().nullable(),
    to_outlet: z.object({ name: z.string() }).optional().nullable(),
    source_transfer: z.object({
        id: z.number(),
        transfer_number: z.string(),
    }).optional().nullable(),
});

export type ResponseReturnDTO = z.infer<typeof ResponseReturnSchema>;

export const RequestReturnItemSchema = z.object({
    product_id: z.coerce.number({ error: "ID Produk harus berupa angka" }),
    quantity: z.coerce.number().min(0.01, "Kuantitas minimal 0.01"),
    notes: z.string().optional(),
});

export const RequestReturnSchema = z.object({
    from_type: z.enum(["WAREHOUSE", "OUTLET"]),
    from_warehouse_id: z.coerce.number().optional().nullable(),
    from_outlet_id: z.coerce.number().optional().nullable(),
    to_type: z.enum(["WAREHOUSE", "OUTLET"]).default("WAREHOUSE"),
    to_warehouse_id: z.coerce.number({ error: "Gudang tujuan harus dipilih" }),
    notes: z.string().optional(),
    items: z.array(RequestReturnItemSchema).min(1, "Minimal harus ada 1 item"),
});

export type RequestReturnDTO = z.infer<typeof RequestReturnSchema>;

export const UpdateReturnStatusSchema = z.object({
    status: z.string(),
    notes: z.string().optional(),
});

export type UpdateReturnStatusDTO = z.infer<typeof UpdateReturnStatusSchema>;

export const QueryReturnSchema = z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(25).optional(),
    search: z.string().optional(),
    status: z.string().optional(),
});

export type QueryReturnDTO = z.infer<typeof QueryReturnSchema>;
