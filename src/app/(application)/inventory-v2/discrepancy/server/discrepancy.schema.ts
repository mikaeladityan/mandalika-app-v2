import { z } from "zod";

export const ResponseDiscrepancySchema = z.object({
    id: z.number(),
    product_id: z.number(),
    quantity_requested: z.coerce.number(),
    quantity_packed: z.number().nullable(),
    quantity_received: z.number().nullable(),
    quantity_fulfilled: z.number().nullable(),
    quantity_missing: z.coerce.number().default(0),
    quantity_rejected: z.coerce.number().default(0),
    notes: z.string().nullable(),
    product: z.object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
        product_type: z.object({ name: z.string() }).optional(),
        size: z.object({ size: z.string() }).optional(),
        unit: z.object({ name: z.string() }).optional(),
        gender: z.string().optional(),
    }),
    transfer: z.object({
        id: z.number(),
        transfer_number: z.string(),
        created_at: z.string(),
        from_warehouse: z.object({ name: z.string() }).optional().nullable(),
        to_warehouse: z.object({ name: z.string() }).optional().nullable(),
        to_outlet: z.object({ name: z.string() }).optional().nullable(),
    }),
});

export type ResponseDiscrepancyDTO = z.infer<typeof ResponseDiscrepancySchema>;

export const QueryDiscrepancySchema = z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(25).optional(),
    search: z.string().optional(),
});

export type QueryDiscrepancyDTO = z.infer<typeof QueryDiscrepancySchema>;
