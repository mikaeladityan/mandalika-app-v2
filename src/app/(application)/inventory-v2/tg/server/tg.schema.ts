import { z } from "zod";

export const TransferStatusEnum = [
    "PENDING",
    "APPROVED",
    "SHIPMENT",
    "RECEIVED",
    "FULFILLMENT",
    "COMPLETED",
    "PARTIAL",
    "MISSING",
    "REJECTED",
    "CANCELLED"
] as const;

export const RequestTransferGudangItemSchema = z.object({
    product_id: z.coerce.number({ error: "ID Produk harus berupa angka" }),
    quantity_requested: z.coerce.number().min(0.01, "Kuantitas permintaan minimal 0.01"),
    notes: z.string().optional(),
});

export const RequestTransferGudangSchema = z.object({
    date: z.string().min(1, "Tanggal wajib diisi"),
    from_warehouse_id: z.coerce.number({ error: "Gudang asal harus dipilih" }),
    to_warehouse_id: z.coerce.number({ error: "Gudang tujuan harus dipilih" }),
    notes: z.string().optional(),
    items: z.array(RequestTransferGudangItemSchema).min(1, "Minimal harus ada 1 item"),
});

export const UpdateTransferGudangStatusSchema = z.object({
    status: z.enum(TransferStatusEnum),
    notes: z.string().optional(),
    items: z
        .array(
            z.object({
                id: z.number(),
                quantity_packed: z.coerce.number().optional(),
                quantity_received: z.coerce.number().optional(),
                quantity_fulfilled: z.coerce.number().optional(),
                quantity_missing: z.coerce.number().optional(),
                quantity_rejected: z.coerce.number().optional(),
            }),
        )
        .optional(),
    photos: z.array(z.string()).optional(),
});

export const ResponseTransferGudangSchema = z.object({
    id: z.number(),
    transfer_number: z.string(),
    barcode: z.string(),
    date: z.string(),
    status: z.enum(TransferStatusEnum),
    from_warehouse_id: z.number().nullable().optional(),
    to_warehouse_id: z.number().nullable().optional(),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    from_warehouse: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .optional(),
    to_warehouse: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .optional(),
    items: z.array(z.any()).optional(),
    photos: z.array(z.any()).optional(),
});

export const QueryTransferGudangSchema = z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(10).optional(),
    search: z.string().optional(),
    status: z.enum(TransferStatusEnum).optional(),
    from_warehouse_id: z.coerce.number().optional(),
    to_warehouse_id: z.coerce.number().optional(),
});

export type RequestTransferGudangDTO = z.infer<typeof RequestTransferGudangSchema>;
export type UpdateTransferGudangStatusDTO = z.infer<typeof UpdateTransferGudangStatusSchema>;
export type ResponseTransferGudangDTO = z.infer<typeof ResponseTransferGudangSchema>;
export type QueryTransferGudangDTO = z.infer<typeof QueryTransferGudangSchema>;
