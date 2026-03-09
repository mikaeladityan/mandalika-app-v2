import z from "zod";

export const RecipeImportRowSchema = z.object({
    "PRODUCT CODE": z.string().min(1),
    "MATERIAL CODE": z.string().min(1),
    QTY: z.number(),
});

export type RecipeImportRow = z.infer<typeof RecipeImportRowSchema>;
export type RecipeImportPreviewDTO = {
    product_code: string;
    product_name: string;
    product_type: string;
    material_name: string;
    product_size: string;
    qty: number;

    errors: string[];
};

export type ResponseRecipeImportDTO = {
    import_id: string;
    total: number;
    valid: number;
    invalid: number;
};
