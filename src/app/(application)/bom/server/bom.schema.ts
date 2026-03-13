import { z } from "zod";

export const QueryBOMSchema = z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(1000).default(25).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["product_name", "material_name", "quantity"]).default("product_name").optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});

export type QueryBOMDTO = z.infer<typeof QueryBOMSchema>;

export type RequestBOMDTO = {
    month?: number;
    year?: number;
};

export type ResponseBOMDTO = {
    id: number;
    material: {
        id: number;
        barcode: string | null;
        name: string;
        quantity: number;
        uom: string;
    };
    needs_to_buy: Array<{
        period: string;
        month: number;
        year: number;
        value: number;
    }>;
    safety_stock_x_bom: number;
};

export type ResponseGroupedBOMDTO = {
    product: {
        id: number;
        code: string;
        name: string;
        type: string;
        gender: string;
        size: string;
        uom: string;
    };
    sales_history: Array<{
        period: string;
        month: number;
        year: number;
        value: number;
    }>;
    forecast: Array<{
        period: string;
        month: number;
        year: number;
        value: number;
    }>;
    safety_stock: number;
    items: ResponseBOMDTO[];
};

export type ResponseBOMListDTO = {
    data: ResponseGroupedBOMDTO[];
    len: number;
};
