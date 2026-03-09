import { z } from "zod";

export const QueryRecomendationSchema = z.object({
    page: z.number().min(1).optional().default(1),
    take: z.number().min(1).optional().default(20),
    search: z.string().optional(),
    month: z.number().optional(),
    year: z.number().optional(),
    period: z.date().or(z.string()).optional(),
    type: z.enum(["ffo", "lokal", "impor"]).optional(),
});

export type QueryRecomendationDTO = z.infer<typeof QueryRecomendationSchema>;

export const RequestAccRecommendationSchema = z.object({
    id: z.number(),
    status: z.literal("ACC"),
});

export type RequestAccRecommendationDTO = z.infer<typeof RequestAccRecommendationSchema>;

export type RecomendationResponse = {
    material_id: number;
    barcode: string;
    material_name: string;
    supplier_name: string;
    moq: number;
    lead_time: number;
    uom: string;
    current_stock: number;
    stock_fg_x_resep: number;
    open_po: number;
    pic_order_quantity: number;
    stock_plus_po: number;
    total_needs: number;
    forecast_target_month_needs?: number;
    recommendation: number | null;
    recommendation_id: number | null;
    status: string;
    pic_id: string | null;
    open_po_expected_arrival: Date | string | null;
    sales: { month: number; year: number; period: Date | string; key: string; quantity: number }[];
    needs: { month: number; year: number; period: Date | string; key: string; quantity: number }[];
    fg_stock_breakdown?: {
        product_name: string;
        product_code: string;
        fg_stock: number;
        recipe_qty: number;
        size_multiplier: number;
        contribution: number;
    }[];
    fg_forecast_breakdown?: {
        product_name: string;
        product_code: string;
        forecast_qty: number;
        recipe_qty: number;
        size_multiplier: number;
        contribution: number;
    }[];
    inv_period?: { month: number; year: number; period: Date | string };
};
