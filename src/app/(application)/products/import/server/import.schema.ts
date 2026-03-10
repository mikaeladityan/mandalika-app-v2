import { GenderEnumDTO } from "@/shared/types";
import z from "zod";

export const ProductImportRowSchema = z.object({
    "PRODUCT CODE": z.string().min(1),
    "PRODUCT NAME": z.string().min(1),
    TYPE: z.string().min(1),
    GENDER: z.string(),
    SIZE: z.coerce.number().int().positive(),
    UOM: z.string().min(1),
    EDAR: z.coerce.number().min(0).optional().default(0),
    SAFETY: z.coerce.number().min(0).optional().default(0),
});

export type ProductImportRow = z.infer<typeof ProductImportRowSchema>;
export type ProductImportPreviewDTO = {
    code: string;
    name: string;
    gender: GenderEnumDTO;
    size: number;
    type: string | null;
    unit: string | null;
    distribution_percentage: number;
    safety_percentage: number;
    errors: string[];
};

export type ResponseProductImportDTO = {
    import_id: string;
    total: number;
    valid: number;
    invalid: number;
};
