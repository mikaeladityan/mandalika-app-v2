import z from "zod";

// ─── Request Schema ─────────────────────────────────────────────────────────
export const RequestTypeSchema = z.object({
    name: z.string().min(1, "Nama tipe wajib diisi").max(50),
});

// ─── Query Schema ───────────────────────────────────────────────────────────
export const QueryTypeSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(25).optional(),
});

// ─── Response Schema ────────────────────────────────────────────────────────
export const ResponseTypeSchema = RequestTypeSchema.extend({
    id: z.number(),
    slug: z.string(),
});

// Backward-compatible alias
export const TypeResponseSchema = ResponseTypeSchema;

// ─── DTOs ───────────────────────────────────────────────────────────────────
export type RequestTypeDTO = z.infer<typeof RequestTypeSchema>;
export type UpdateTypeDTO = Partial<RequestTypeDTO>;
export type QueryTypeDTO = z.infer<typeof QueryTypeSchema>;
export type ResponseTypeDTO = z.infer<typeof ResponseTypeSchema>;

// Backward-compatible alias
export type TypeResponseDTO = ResponseTypeDTO;
