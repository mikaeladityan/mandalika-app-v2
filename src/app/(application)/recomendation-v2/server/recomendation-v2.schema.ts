import { z } from "zod";

export const QueryRecomendationV2Schema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    take: z.coerce.number().min(1).optional().default(25),
    search: z.string().optional(),
    month: z.coerce.number().min(1).max(12).optional(),
    year: z.coerce.number().min(2000).optional(),
    sales_months: z.coerce.number().min(0).max(12).optional().default(3),
    forecast_months: z.coerce.number().min(0).max(12).optional().default(3),
    type: z.enum(["ffo", "lokal", "impor"]).optional(),
});

export type QueryRecomendationV2DTO = z.infer<typeof QueryRecomendationV2Schema>;

export interface RecomendationV2Response {
    ranking: number;
    material_id: number;
    barcode: string | null;
    material_name: string;
    supplier_name: string | null;
    moq: number;
    lead_time: number | null;
    uom: string;
    recommendation_quantity: number;
    current_stock: number;
    open_po: number;
    stock_fg_x_resep: number;
    safety_stock_x_resep: number;
    forecast_needed: number;

    sales: { month: number; year: number; key: string; quantity: number }[];
    needs: { month: number; year: number; key: string; quantity: number }[];
    open_pos: { month: number; year: number; key: string; quantity: number }[];
}
