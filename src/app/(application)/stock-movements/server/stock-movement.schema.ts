import { z } from "zod";
import { 
    MOVEMENT_ENTITY_TYPE, 
    MOVEMENT_LOCATION_TYPE, 
    MOVEMENT_REF_TYPE, 
    MOVEMENT_TYPE 
} from "@/shared/types";

export const QueryStockMovementSchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    take: z.coerce.number().min(1).max(100).default(10).optional(),
    sortBy: z.enum(["created_at", "quantity"]).default("created_at").optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
    entity_type: z.enum(MOVEMENT_ENTITY_TYPE).optional(),
    entity_id: z.coerce.number().optional(),
    location_type: z.enum(MOVEMENT_LOCATION_TYPE).optional(),
    location_id: z.coerce.number().optional(),
    movement_type: z.enum(MOVEMENT_TYPE).optional(),
    reference_type: z.enum(MOVEMENT_REF_TYPE).optional(),
    reference_id: z.coerce.number().optional(),
});

export const ResponseStockMovementSchema = z.object({
    id: z.number(),
    entity_type: z.enum(MOVEMENT_ENTITY_TYPE),
    entity_id: z.number(),
    location_type: z.enum(MOVEMENT_LOCATION_TYPE),
    location_id: z.number(),
    movement_type: z.enum(MOVEMENT_TYPE),
    quantity: z.coerce.number(),
    qty_before: z.coerce.number(),
    qty_after: z.coerce.number(),
    reference_id: z.number().nullable(),
    reference_type: z.enum(MOVEMENT_REF_TYPE).nullable(),
    created_at: z.string(),
    created_by: z.string(),
    product: z.object({ name: z.string(), code: z.string() }).optional(),
    warehouse: z.object({ name: z.string() }).optional(),
    outlet: z.object({ name: z.string() }).optional(),
});

export type QueryStockMovementDTO = z.infer<typeof QueryStockMovementSchema>;
export type ResponseStockMovementDTO = z.infer<typeof ResponseStockMovementSchema>;
