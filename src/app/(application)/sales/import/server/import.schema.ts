import z from "zod";

export const SalesImportRowSchema = z.object({
    "PRODUCT CODE": z.string().min(1),
    "TOTAL SALES": z.string().min(1),
});

export type SalesImportRow = z.infer<typeof SalesImportRowSchema>;
export type SalesImportPreviewDTO = {
    code: string;
    product_name: string;
    type: string | null;
    amount: number | string;
    errors: string[];
};

export type ResponseSalesImportDTO = {
    import_id: string;
    total: number;
    valid: number;
    invalid: number;
};

export const RequestSalesImportSchema = z.object({
    import_id: z.string(),
    month: z.number().min(1).max(12).optional(),
    year: z.number().min(1900).max(2100).optional(),
});

export type RequestSalesImportDTO = z.infer<typeof RequestSalesImportSchema>;
export type ResponseSalesExportDTO = {
    code: string;
    product_name: string;
    type: string | null;
    size: string | null;
    amount: number | string;
};
