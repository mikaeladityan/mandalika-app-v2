import { GenderEnumDTO } from "@/shared/types";
import z from "zod";

export const ProductImportRowSchema = z.object({
    "PRODUCT CODE": z.string().min(1),
    "PRODUCT NAME": z.string().min(1),
    TYPE: z.string().min(1),
    // GENDER: z.enum(GENDER).optional().default("UNISEX"),
    GENDER: z.string(),
    SIZE: z.coerce.number().int().positive(),
    UOM: z.string().min(1),
});

export type ProductImportRow = z.infer<typeof ProductImportRowSchema>;
export type ProductImportPreviewDTO = {
    code: string;
    name: string;
    gender: GenderEnumDTO;
    size: number;
    type: string | null;
    unit: string | null;
    errors: string[];
};

export type ResponseProductImportDTO = {
    import_id: string;
    total: number;
    valid: number;
    invalid: number;
};
