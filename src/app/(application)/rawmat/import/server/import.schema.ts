import z from "zod";
export const RawmatImportRowSchema = z.object({
    BARCODE: z.string(),
    "MATERIAL NAME": z.string(),
    CATEGORY: z.string(),
    UOM: z.string().optional(),
    MOQ: z.number().optional(),
    "MIN STOK": z.number().optional(),
    "LEAD TIME": z.number().optional(),
    SUPPLIER: z.string().optional(),
    "LOCAL/IMPORT": z.string().optional(),
    PRICE: z.number(),
});
export type RawmatImportRow = z.infer<typeof RawmatImportRowSchema>;
export type RawmatImportPreviewDTO = {
    barcode: string;
    name: string;
    price: number | null;
    min_buy: number | null;
    min_stock: number | null;
    unit: string;
    category: string;
    supplier: string;
    country: string;
    lead_time: number;
    errors: string[];
};

export type ResponseRawmatImportDTO = {
    import_id: string;
    total: number;
    valid: number;
    invalid: number;
};
