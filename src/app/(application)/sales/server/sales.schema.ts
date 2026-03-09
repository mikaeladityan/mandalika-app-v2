import z, { string } from "zod";
import { ResponseProductSchema } from "../../products/server/products.schema";
import { GENDER } from "@/shared/types";

export const RequestSalesSchema = z.object({
    product_id: z.number("Produk tidak boleh kosong"),
    month: z.number().optional(),
    year: z.number().optional(),
    quantity: z.coerce.number().min(1, "Minimal 1 penjualan"),
});

export type RequestSalesDTO = z.input<typeof RequestSalesSchema>;

export const ResponseSalesSchema = RequestSalesSchema.extend({
    id: z.number().optional(),
    month: z.number(),
    year: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
    product: ResponseProductSchema.pick({
        id: true,
        code: true,
        name: true,
        product_type: true,
    }).extend({ size: z.string() }),
});

export const QuerySalesSchema = z.object({
    size: z.number().optional(),
    variant: z.string().optional(),
    gender: z.enum(GENDER).optional(),
    horizon: z.number().optional(),
    product_id: z.number().optional(),
    product_id_2: z.number().optional(),

    year: z.number().optional(),
    month: z.number().optional(),
    search: z.string().optional(), // Added search parameter

    page: z.number().int().positive().default(1).optional(),
    take: z.number().int().positive().max(100).default(10).optional(),

    sortBy: z.enum(["product_id", "name", "code", "quantity"]).default("quantity"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ResponseSalesDTO = z.infer<typeof ResponseSalesSchema>;
export type QuerySalesDTO = z.infer<typeof QuerySalesSchema>;
