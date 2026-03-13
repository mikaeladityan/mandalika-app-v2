import z from "zod";
import { ResponseProductSchema } from "../../products/server/products.schema";
import { ResponseRawMaterialSchema } from "../../rawmat/server/rawmat.schema";

export const RequestRecipeSchema = z.object({
    product_id: z.number({ message: "Produk tidak boleh kosong" }),
    version: z.number().int().min(1).default(1),
    is_active: z.boolean().default(true),
    description: z.string().optional().nullable(),
    raw_material: z
        .array(
            z.object({
                raw_material_id: z.number(),
                quantity: z.preprocess(
                    (val) => (val === "" ? undefined : Number(val)),
                    z.coerce.number({ error: "Format quantity tidak valid" }),
                ),
            }),
        )
        .min(1, "Raw material tidak boleh kosong"),
});
export const ResponseRecipeSchema = z.object({
    id: z.number(),
    is_active: z.boolean(),
    version: z.number(),
    description: z.string().nullable(),
    quantity: z.number().optional(),
    product: ResponseProductSchema.pick({
        id: true,
        code: true,
        name: true,
        size: true,
        product_type: true,
        unit: true,
    }).optional(),
    raw_material: ResponseRawMaterialSchema.pick({
        name: true,
        unit_raw_material: true,
        price: true,
        current_stock: true,
        barcode: true,
    }).optional(),
    total_material: z.number().optional(),
});
export const QueryRecipeSchema = z.object({
    product_id: z.number().optional(),
    raw_mat_id: z.number().optional(),
    search: z.string().optional(), // Added search parameter

    page: z.number().int().positive().default(1).optional(),
    take: z.number().int().positive().max(100).default(10).optional(),

    sortBy: z.enum(["product", "quantity", "current_stock", "total_material", "totalMaterial"]).default("product"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type RequestRecipeDTO = z.input<typeof RequestRecipeSchema>;
export type ResponseRecipeDTO = z.output<typeof ResponseRecipeSchema>;
export type QueryRecipeDTO = z.input<typeof QueryRecipeSchema>;

// POV Product
export type ResponseDetailRecipeDTO = {
    version: number;
    description: string | null;
    is_active: boolean;
    product_id: number;
    code: string;
    name: string;
    unit: string;
    type: string;
    recipes: Array<{
        raw_mat_id: number;
        barcode: string | null;
        name: string;
        unit: string;
        price: number;
        quantity: number;
    }>;
};
