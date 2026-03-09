import z from "zod";

export const ProductInventoryImportRowSchema = z.object({
    "PRODUCT CODE": z.string().min(1),
    AMOUNT: z.number().min(1),
});

export type ProductInventoryImportRow = z.infer<typeof ProductInventoryImportRowSchema>;
export type ProductInventoryImportPreviewDTO = {
    code: string;
    name: string;
    size: string;
    type: string;
    amount: number;
    errors: string[];
};

export type ResponseProductInventoryImportDTO = {
    import_id: string;
    total: number;
    valid: number;
    invalid: number;
};
