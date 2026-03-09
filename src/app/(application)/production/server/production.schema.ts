import z from "zod";

export const RequestSyncProductionSchema = z.object({
    product_id: z.number(),
    month: z.number(),
    year: z.number(),
});

export type RequestSyncProductionDTO = z.input<typeof RequestSyncProductionSchema>;
