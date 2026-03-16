import { z } from "zod";

export const QueryOpenPoSchema = z.object({
    page: z.number().min(1).optional().default(1),
    take: z.number().min(1).optional().default(20),
    search: z.string().optional(),
    status: z.string().optional().default("OPEN"),
    month: z.number().optional(),
    year: z.number().optional(),
    supplier_id: z.number().optional(),
});

export type QueryOpenPoDTO = z.infer<typeof QueryOpenPoSchema>;

export const RequestUpdateOpenPoSchema = z.object({
    po_number: z.string().optional(),
    expected_arrival: z.string().optional().nullable(),
    status: z.string().optional(),
});

export type RequestUpdateOpenPoDTO = z.infer<typeof RequestUpdateOpenPoSchema>;

export type OpenPoResponse = {
    id: number;
    raw_material_id: number;
    barcode: string | null;
    material_name: string;
    supplier_name: string;
    po_number: string | null;
    quantity: number;
    price: number;
    subtotal: number;
    order_date: string | Date;
    expected_arrival: string | Date | null;
    status: string;
};
