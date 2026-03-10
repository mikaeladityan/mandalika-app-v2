import { GENDER, STATUS } from "@/shared/types";
import z from "zod";
import { UnitResponseSchema } from "../(component)/unit/server/unit.schema";
import { TypeResponseSchema } from "../(component)/type/server/type.schema";
import { ResponseProductSizeSchema } from "../(component)/size/server/size.schema";

export const RequestProductSchema = z.object({
    code: z.string().max(100).regex(/^\S+$/, { message: "Gunakan '_' (underscore) untuk spasi" }),
    name: z
        .string()
        .min(5, "Nama produk minimal memiliki 5 karakter")
        .max(100, "Nama produk tidak boleh melebihi 100 karakter"),
    size: z.coerce.number("Ukuran tidak boleh kosong").min(2),
    gender: z.enum(GENDER).optional().default("UNISEX"),
    status: z.enum(STATUS).default("PENDING").optional(),
    z_value: z.number().default(1.65),
    lead_time: z.coerce.number().int().min(1).default(14),
    review_period: z.coerce.number().int().min(1).default(30),
    unit: z.string().nullable().optional(),
    product_type: z.string().nullable().optional(),
    distribution_percentage: z.coerce.number().min(0).default(0).optional(),
    safety_percentage: z.coerce.number().min(0).default(0).optional(),
});

export const ResponseProductSchema = RequestProductSchema.extend({
    code: z.string().max(100).regex(/^\S+$/, { message: "Gunakan '_' (underscore) untuk spasi" }),
    name: z
        .string()
        .min(5, "Nama produk minimal memiliki 5 karakter")
        .max(100, "Nama produk tidak boleh melebihi 100 karakter"),
    status: z.enum(STATUS).default("PENDING").optional(),
    id: z.number(),
    gender: z.enum(GENDER).default("UNISEX"),
    size: ResponseProductSizeSchema.nullable().optional(),
    unit: UnitResponseSchema.nullable(),
    product_type: TypeResponseSchema.nullable(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date().nullable(),
});

export const QueryProductSchema = z.object({
    type_id: z.number().positive().optional(), // ambil type id
    size_id: z.number().positive().optional(), // filter by ukuran produk
    gender: z.enum(GENDER).optional(),

    page: z.number().int().positive().default(1).optional(),
    take: z.number().int().positive().max(100).default(25).optional(),

    search: z.string().optional(),
    status: z.enum(STATUS).optional(),
    sortBy: z
        .enum([
            "code",
            "name",
            "updated_at",
            "created_at",
            "gender",
            "type",
            "size",
            "lead_time",
            "distribution_percentage",
            "safety_percentage",
        ])
        .default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type RequestProductDTO = z.input<typeof RequestProductSchema>;
export type ResponseProductDTO = z.infer<typeof ResponseProductSchema>;
export type QueryProductDTO = z.infer<typeof QueryProductSchema>;
