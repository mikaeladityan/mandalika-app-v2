import z from "zod";

export const RequestProductInventorySchema = z.object({
    product_id: z.coerce
        .number({
            error: "Product ID wajib diisi",
        })
        .positive(),

    warehouse_id: z.coerce
        .number({
            error: "Warehouse ID wajib diisi",
        })
        .positive(),

    quantity: z.coerce.number().min(0, "Quantity tidak boleh negatif").default(0),

    min_stock: z.coerce.number().min(0, "Min stock tidak boleh negatif").nullish(),
});

export const ResponseProductInventorySchema = RequestProductInventorySchema.extend({
    created_at: z.date(),
    updated_at: z.date().optional(),
});

export type RequestProductInventoryDTO = z.infer<typeof RequestProductInventorySchema>;

export const RequestRawMaterialInventorySchema = z.object({
    raw_material_id: z.coerce
        .number({
            error: "Raw Material ID wajib diisi",
        })
        .positive(),

    warehouse_id: z.coerce
        .number({
            error: "Warehouse ID wajib diisi",
        })
        .positive(),

    quantity: z.coerce.number().min(0, "Quantity tidak boleh negatif").default(0),

    min_stock: z.coerce.number().min(0, "Min stock tidak boleh negatif").nullish(),
});

export const ResponseRawMaterialInventorySchema = RequestRawMaterialInventorySchema.extend({
    created_at: z.date(),
    updated_at: z.date().optional(),
});

export type RequestRawMaterialInventoryDTO = z.infer<typeof RequestRawMaterialInventorySchema>;

export const UpdateInventoryQtySchema = RequestProductInventorySchema.pick({
    quantity: true,
});

const RequestWarehouseAddressSchema = z.object({
    street: z
        .string("Jalan tidak boleh kosong")
        .max(200, "Jalan tidak boleh lebih dari 200 karakter"),
    district: z.string("Kecamatan tidak boleh kosong"),
    sub_district: z.string("Kelurahan tidak boleh kosong"),
    city: z.string("Kota tidak boleh kosong"),
    province: z.string("Provinsi tidak boleh kosong"),
    country: z.string().max(100),
    postal_code: z.string().max(6, "Kode Pos tidak boleh lebih dari 6 karakter"),
    notes: z.string().max(200, "Catatan tidak boleh lebih dari 200 karakter").nullable(),
    url_google_maps: z.url().max(200, "Url gmaps tidak boleh lebih dari 200 karakter").nullable(),
});

const ResponseWarehouseAddressSchema = RequestWarehouseAddressSchema.extend({
    created_at: z.date(),
    updated_at: z.date(),
});

export const RequestWarehouseSchema = z.object({
    name: z.string(),
    type: z.enum(["RAW_MATERIAL", "FINISH_GOODS"]),
    warehouse_address: RequestWarehouseAddressSchema.optional(),
});

export const ResponseWarehouseSchema = RequestWarehouseSchema.pick({
    name: true,
    type: true,
}).extend({
    warehouse_address: ResponseWarehouseAddressSchema.optional(),
    product_inventories: z.array(ResponseProductInventorySchema),
    raw_material_inventories: z.array(ResponseRawMaterialInventorySchema),
    id: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date().nullable(),
});

export type RequestWarehouseDTO = z.input<typeof RequestWarehouseSchema>;
export type ResponseWarehouseDTO = z.output<typeof ResponseWarehouseSchema>;

export const QueryProductInventorySchema = z.object({
    page: z.number().int().positive().default(1).optional(),
    type: z.enum(["RAW_MATERIAL", "FINISH_GOODS"]),
    take: z.number().int().positive().max(100).default(10).optional(),

    search: z.string().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).optional(),
    sortBy: z.enum(["code", "name", "quantity", "created_at", "updated_at"]).default("updated_at"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
export type QueryProductInventoryDTO = z.infer<typeof QueryProductInventorySchema>;
