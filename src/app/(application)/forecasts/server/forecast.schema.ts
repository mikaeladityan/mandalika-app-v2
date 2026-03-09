import { z } from "zod";
const ForecastBaseSchema = z.object({
    product_id: z.number().int().positive("Produk tidak valid"),

    horizon: z
        .number()
        .int()
        .min(1, "Horizon minimal 1 bulan")
        .max(12, "Horizon maksimal 12 bulan"),

    forecast_model: z
        .enum([
            "SIMPLE_MOVING_AVERAGE",
            "EXPONENTIAL_SMOOTHING",
            "HOLT_WINTERS",
            "LINEAR_REGRESSION",
            "ENSEMBLE",
            "AUTO",
            // "ARIMA",
        ])
        .default("AUTO"),

    year: z.number().int().min(2000).optional(),
    month: z.number().int().min(1).max(12).optional(),
    preview: z.boolean().optional().default(false),
});

export const RequestForecastSchema = ForecastBaseSchema.refine(
    (data) => (data.year && data.month) || (!data.year && !data.month),
    {
        message: "tahun dan bulan harus diisi bersamaan",
        path: ["year", "month"],
    },
);

export const RequestReconcileSchema = ForecastBaseSchema.pick({
    product_id: true,
    year: true,
    month: true,
})
    .extend({
        additionalRatio: z.coerce.number().optional(),
    })
    .refine((data) => (data.year && data.month) || (!data.year && !data.month), {
        message: "tahun dan bulan harus diisi bersamaan",
        path: ["year", "month"],
    });

export const QueryForecastSchema = z.object({
    horizon: z.coerce.number().int().min(12).max(24).optional(),

    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(10).optional(),

    search: z.string().optional(),
});

export const RequestAddRatioForecastSchema = ForecastBaseSchema.omit({
    horizon: true,
    preview: true,
    forecast_model: true,
    month: true,
    year: true,
}).extend({
    year: z.number().int().min(2000),
    month: z.number().int().min(1).max(12),
    additionalRatio: z.number(),
});

export type RequestForecastDTO = z.input<typeof RequestForecastSchema>;
export type RequestReconcileDTO = z.input<typeof RequestReconcileSchema>;
export type RequestAddRatioForecastDTO = z.input<typeof RequestAddRatioForecastSchema>;
export type QueryForecastDTO = z.infer<typeof QueryForecastSchema>;
type MonthlyData = {
    month: number;
    year: number;
    period: Date | string;
    base_forecast: number;
    final_forecast: number | null;
    additional_ratio: number;
    system_ratio: number;
    absolute_error: number | null;
    trend: string;
    is_current_month: boolean;
    is_actionable: boolean;
};

export type ResponseForecastDTO = {
    product_id: number;
    product_code: string | null;
    product_name: string;
    product_type: string;
    product_size: string;
    brand: string | null;
    z_value: number;
    monthly_data: Array<MonthlyData>;
    need_produce: number;
    safety_stock_summary: {
        mean_absolute_error: number;
        safety_stock_quantity: number;
        safety_stock_ratio: number | string;
        additional_ratio: number;
        last_updated: Date | null;
    };
};
