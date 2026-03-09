import z from "zod";

export const RequestRawMatStockSchema = z.object({
    barcode: z.string(),
    amount: z.number(),
    warehouse_id: z.string(),
});

export const ResponseRawMatStockSchema = z.object({
    barcode: z.string(),
    name: z.string(),
    category: z.string().optional(),
    uom: z.string().optional(),
    amount: z.number(),
    warehouse: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .optional(),
});

export const QueryRawMatStockSchema = z.object({
    category_id: z.number().positive().optional(),
    warehouse_id: z.number().positive().optional(),
    page: z.number().int().positive().default(1).optional(),
    take: z.number().int().positive().max(100).default(25).optional(),
    search: z.string().optional(),
    month: z.coerce
        .number()
        .int()
        .min(1)
        .max(12)
        .default(new Date().getMonth() + 1)
        .optional(),
    year: z.coerce.number().int().min(2000).default(new Date().getFullYear()).optional(),
    sortBy: z
        .enum(["barcode", "name", "updated_at", "created_at", "category", "amount"])
        .default("updated_at"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type RequestRawMatStockDTO = z.infer<typeof RequestRawMatStockSchema>;
export type ResponseRawMatStockDTO = z.output<typeof ResponseRawMatStockSchema>;
export type QueryRawMatStockDTO = z.input<typeof QueryRawMatStockSchema>;
