import { ResponseRawMaterialSchema } from "@/app/(application)/rawmat/server/rawmat.schema";
import z from "zod";

export const RequestBOMSchema = z.object({
    month: z.coerce.number().optional(),
    year: z.coerce.number().optional(),
});

export const ResponseBOMSchema = z.object({
    id: z.number(),
    // Data Produk (Finished Good)
    product: z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
        size: z.number(),
        forecast_value: z.number(),
        need_produce: z.number(),
    }),
    // Data Material (Raw Material)
    material: z.object({
        id: z.number(),
        name: z.string(),
        barcode: z.string(),
        unit: z.string(),
        recipes: z.number(),
    }),
    // Data Kebutuhan
    month: z.number(),
    year: z.number(),
    period: z.date().or(z.string()),
    total_needed: z.number(),
    shortage: z.number(),
    exploded_at: z.date().or(z.string()), // Handle string dari JSON response
});

export type RequestBOMDTO = z.input<typeof RequestBOMSchema>;
export type ResponseBOMDTO = z.output<typeof ResponseBOMSchema>;

export const QueryBOMSchema = z.object({
    search: z.string().optional(), // Added search parameter
    page: z.number().int().positive().default(1).optional(),
    take: z.number().int().positive().max(1000).default(10).optional(),

    sortBy: z.enum(["exploded_at", "total_needed", "month"]).default("exploded_at"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type QueryBOMDTO = z.infer<typeof QueryBOMSchema>;
