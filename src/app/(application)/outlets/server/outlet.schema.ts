import z from "zod";

const RequestOutletAddressSchema = z.object({
    street: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    sub_district: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    country: z.string().max(100).default("Indonesia").nullable().optional(),
    postal_code: z.string().max(6, "Kode Pos maksimal 6 karakter").nullable().optional(),
    notes: z.string().max(200).nullable().optional(),
    url_google_maps: z
        .string()
        .url("URL Google Maps tidak valid")
        .or(z.literal(""))
        .nullable()
        .optional(),
});

export const RequestOutletSchema = z.object({
    name: z.string().min(1, "Nama outlet tidak boleh kosong").max(100),
    code: z
        .string()
        .min(1, "Kode outlet tidak boleh kosong")
        .max(20)
        .toUpperCase()
        .regex(/^[A-Z0-9-]+$/, "Kode hanya boleh huruf kapital, angka, dan strip"),
    phone: z.string().max(20).nullable().optional(),
    type: z.enum(["RETAIL", "MARKETPLACE"]).default("RETAIL"),
    warehouse_ids: z
        .array(z.coerce.number().int().positive())
        .min(1, "Setidaknya 1 gudang harus dipilih"),
    address: RequestOutletAddressSchema.optional(),
});

export const UpdateOutletSchema = RequestOutletSchema.partial();

export const ResponseOutletSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    phone: z.string().nullable(),
    is_active: z.boolean(),
    type: z.enum(["RETAIL", "MARKETPLACE"]),
    warehouses: z
        .array(
            z.object({
                warehouse: z.object({
                    id: z.number(),
                    code: z.string(),
                    name: z.string(),
                    type: z.string(),
                }),
            }),
        )
        .optional(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
    address: z
        .object({
            street: z.string().nullable(),
            district: z.string().nullable(),
            sub_district: z.string().nullable(),
            city: z.string().nullable(),
            province: z.string().nullable(),
            country: z.string().nullable(),
            postal_code: z.string().nullable(),
            notes: z.string().nullable(),
            url_google_maps: z.string().nullable(),
        })
        .nullable(),
    _count: z
        .object({
            inventories: z.number(),
        })
        .optional(),
});

export const QueryOutletSchema = z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(25).optional(),
    search: z.string().optional(),
    status: z.enum(["active", "deleted"]).optional(),
    type: z.enum(["RETAIL", "MARKETPLACE"]).optional(),
    warehouse_id: z.coerce.number().int().positive().optional(),
    sortBy: z.enum(["name", "code", "created_at", "updated_at"]).default("updated_at").optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});

export const BulkStatusSchema = z.object({
    ids: z.array(z.number().int().positive()),
    status: z.enum(["active", "deleted"]),
});

export const BulkDeleteSchema = z.object({
    ids: z.array(z.number().int().positive()),
});

export type RequestOutletDTO = z.infer<typeof RequestOutletSchema>;
export type UpdateOutletDTO = z.infer<typeof UpdateOutletSchema>;
export type ResponseOutletDTO = z.infer<typeof ResponseOutletSchema>;
export type QueryOutletDTO = z.infer<typeof QueryOutletSchema>;
export type BulkStatusDTO = z.infer<typeof BulkStatusSchema>;
export type BulkDeleteDTO = z.infer<typeof BulkDeleteSchema>;
