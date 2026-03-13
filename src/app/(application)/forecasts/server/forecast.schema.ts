import { z } from "zod";

export const RunForecastSchema = z.object({
    product_id: z.coerce.number().optional().nullable(),
    start_month: z.coerce.number().int().min(1).max(12),
    start_year: z.coerce.number().int().min(2000).max(2100),
    horizon: z.coerce.number().int().min(1).max(12).default(12),
});

export const QueryForecastSchema = z.object({
    search: z.string().optional(),
    status: z.enum(["DRAFT", "FINALIZED", "ADJUSTED"]).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(1000).default(25).optional(),
    horizon: z.coerce.number().int().min(3).max(12).default(12).optional(),
});

export type RunForecastDTO = z.infer<typeof RunForecastSchema>;
export type QueryForecastDTO = z.infer<typeof QueryForecastSchema>;
export type RequestReconcileDTO = { 
    product_id: number;
    month?: number;
    year?: number;
};
export type RequestAddRatioForecastDTO = {
    product_id: number;
    month: number;
    year: number;
    additionalRatio: number;
};

export type ResponseForecastDTO = {
    product_id: number;
    product_code: string | null;
    product_name: string;
    product_type: string;
    product_size: string;
    z_value: number;
    distribution_percentage: number | null;
    safety_percentage: number | null;
    current_stock: number;
    need_produce: number;
    monthly_data: Array<{
        month: number;
        year: number;
        period: string;
        base_forecast: number;
        final_forecast: number | null;
        trend: string;
        status: string | null;
        is_current_month: boolean;
        is_actionable: boolean;
        percentage_value: number | null;
    }>;
    safety_stock_summary: {
        safety_stock_quantity: number | null;
        safety_stock_ratio: number | null;
        avg_forecast: number | null;
        total_forecast: number | null;
        total_demand: number | null;
        last_updated: Date | null;
    } | null;
};
