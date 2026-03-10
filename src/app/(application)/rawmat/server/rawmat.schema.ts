import z from "zod";

export const RequestRawMaterialSchema = z.object({
    barcode: z
        .string({ error: "Barcode tidak valid" })
        .max(50, "Barcode material tidak boleh lebih dari 50 karakter")
        .nullable()
        .optional(),
    name: z
        .string({ error: "Nama material tidak boleh kosong" })
        .max(100, "Nama material tidak boleh lebih dari 100 karakter"),
    price: z.coerce.number(),
    min_buy: z.coerce.number().optional(),
    min_stock: z.coerce.number().optional(),
    supplier_id: z.coerce.number().optional(),

    raw_mat_category: z.string().optional(),
    unit: z.string(),
});

export const ResponseRawMaterialSchema = RequestRawMaterialSchema.omit({
    supplier_id: true,
    unit: true,
    raw_mat_category: true,
}).extend({
    id: z.number(),
    current_stock: z.number().optional(),
    supplier: z
        .object({
            id: z.number(),
            name: z.string(),
            country: z.string(),
        })
        .optional(),
    raw_mat_category: z
        .object({
            id: z.number(),
            slug: z.string().nullable(),
            name: z.string(),
        })
        .optional(),
    unit_raw_material: z.object({
        id: z.number(),
        slug: z.string().nullable(),
        name: z.string(),
    }),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable().optional(),
});

export const QueryRawMaterialSchema = z.object({
    page: z.number().int().positive().default(1).optional(),
    take: z.number().int().positive().max(100).default(10).optional(),
    status: z.enum(["actived", "deleted"]).default("actived"),
    search: z.string().optional(),
    sortBy: z
        .enum([
            "barcode",
            "name",
            "updated_at",
            "current_stock",
            "price",
            "created_at",
            "category",
            "supplier",
        ])
        .default("updated_at"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    category_id: z.coerce.number().int().optional(),
    supplier_id: z.coerce.number().int().optional(),
    unit_id: z.coerce.number().int().optional(),
});

export type RequestRawMaterialDTO = z.input<typeof RequestRawMaterialSchema>;
export type ResponseRawMaterialDTO = z.output<typeof ResponseRawMaterialSchema>;

export type QueryRawMaterialDTO = z.infer<typeof QueryRawMaterialSchema>;

export type ResponseUtils = {
    units: Array<{ name: string; slug: string }>;
    suppliers: Array<{ name: string; id: number; country: string }>;
    categories: Array<{ name: string; slug: string }>;
};

export type ResponseCountUtils = {
    units: number;
    suppliers: number;
    categories: number;
};
