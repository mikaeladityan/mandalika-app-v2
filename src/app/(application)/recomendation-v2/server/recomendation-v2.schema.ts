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

export const RequestSaveWorkOrderSchema = z.object({
    raw_mat_id: z.coerce.number(),
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000),
    quantity: z.coerce.number().min(0),
    horizon: z.coerce.number().min(1).max(12).default(1),
    total_needed: z.coerce.number().optional().default(0),
    current_stock: z.coerce.number().optional().default(0),
    stock_fg_x_resep: z.coerce.number().optional().default(0),
    safety_stock_x_resep: z.coerce.number().optional().default(0),
});

export type RequestSaveWorkOrderDTO = z.infer<typeof RequestSaveWorkOrderSchema>;

export const RequestBulkSaveHorizonSchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000),
    horizon: z.coerce.number().min(1).max(12).default(3),
    type: z.enum(["ffo", "lokal", "impor"]).optional(),
});

export type RequestBulkSaveHorizonDTO = z.infer<typeof RequestBulkSaveHorizonSchema>;


export const RequestApproveWorkOrderSchema = z.object({
    id: z.coerce.number(),
});

export type RequestApproveWorkOrderDTO = z.infer<typeof RequestApproveWorkOrderSchema>;

export const WORK_ORDER_STATUS = {
    DRAFT: "DRAFT",
    ACC: "ACC",
} as const;

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

    // Work Order Info
    work_order_id?: number;
    work_order_status?: string;
    work_order_pic_id?: string | null;
    work_order_quantity?: number;
    work_order_horizon?: number;

    sales: { month: number; year: number; key: string; quantity: number }[];
    needs: { month: number; year: number; key: string; quantity: number }[];
    open_pos: { month: number; year: number; key: string; quantity: number }[];
}
