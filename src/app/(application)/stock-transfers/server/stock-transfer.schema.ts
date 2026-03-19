import { z } from "zod";
import { TRANSFER_LOCATION_TYPE, TRANSFER_STATUS } from "@/shared/types";

export const CreateStockTransferItemSchema = z.object({
    product_id: z.number(),
    quantity_requested: z.number().min(0.01),
    notes: z.string().optional(),
});

export const RequestStockTransferSchema = z.object({
    barcode: z.string().min(3).max(20),
    from_type: z.enum(TRANSFER_LOCATION_TYPE),
    from_warehouse_id: z.number().optional(),
    from_outlet_id: z.number().optional(),
    to_type: z.enum(TRANSFER_LOCATION_TYPE),
    to_warehouse_id: z.number().optional(),
    to_outlet_id: z.number().optional(),
    notes: z.string().optional(),
    items: z
        .array(
            z.object({
                product_id: z.number(),
                quantity_requested: z.number().min(0.01),
                notes: z.string().optional(),
            }),
        )
        .min(1),
});

export const RequestUpdateStockTransferStatusSchema = z.object({
    status: z.enum(TRANSFER_STATUS),
    notes: z.string().optional(),
    items: z
        .array(
            z.object({
                id: z.number(), // StockTransferItem ID
                quantity_packed: z.number().optional(),
                quantity_received: z.number().optional(),
                quantity_fulfilled: z.number().min(0).optional(),
                quantity_missing: z.number().min(0).optional(),
                quantity_rejected: z.number().min(0).optional(),
            }),
        )
        .optional(),
});

export const QueryStockTransferSchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    take: z.coerce.number().min(1).max(100).default(10).optional(),
    sortBy: z.enum(["created_at", "transfer_number"]).default("created_at").optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
    search: z.string().optional(),
    status: z.enum(TRANSFER_STATUS).optional(),
    from_type: z.enum(TRANSFER_LOCATION_TYPE).optional(),
    to_type: z.enum(TRANSFER_LOCATION_TYPE).optional(),
});

export const ResponseStockTransferSchema = z.object({
    id: z.number(),
    transfer_number: z.string(),
    barcode: z.string(),
    from_type: z.enum(TRANSFER_LOCATION_TYPE),
    from_warehouse_id: z.number().nullable(),
    from_outlet_id: z.number().nullable(),
    to_type: z.enum(TRANSFER_LOCATION_TYPE),
    to_warehouse_id: z.number().nullable(),
    to_outlet_id: z.number().nullable(),
    status: z.enum(TRANSFER_STATUS),
    notes: z.string().nullable(),
    shipped_at: z.string().nullable(),
    received_at: z.string().nullable(),
    fulfilled_at: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    items: z.array(z.any()),
    from_warehouse: z.object({ name: z.string() }).optional().nullable(),
    from_outlet: z.object({ name: z.string() }).optional().nullable(),
    to_warehouse: z.object({ name: z.string() }).optional().nullable(),
    to_outlet: z.object({ name: z.string() }).optional().nullable(),
});

export type RequestStockTransferDTO = z.infer<typeof RequestStockTransferSchema>;
export type RequestUpdateStockTransferStatusDTO = z.infer<
    typeof RequestUpdateStockTransferStatusSchema
>;
export type QueryStockTransferDTO = z.infer<typeof QueryStockTransferSchema>;
export type ResponseStockTransferDTO = z.infer<typeof ResponseStockTransferSchema>;
