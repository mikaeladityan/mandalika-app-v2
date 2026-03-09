import z from "zod";

// ─── Request Schema ─────────────────────────────────────────────────────────
export const RequestUnitSchema = z.object({
    name: z.string().min(1, "Nama satuan wajib diisi").max(50),
});

// ─── Query Schema ───────────────────────────────────────────────────────────
export const QueryUnitSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    take: z.coerce.number().int().positive().max(100).default(25).optional(),
});

// ─── Response Schema ────────────────────────────────────────────────────────
export const ResponseUnitSchema = RequestUnitSchema.extend({
    id: z.number(),
    slug: z.string(),
});

// Backward-compatible alias
export const UnitResponseSchema = ResponseUnitSchema;

// ─── DTOs ───────────────────────────────────────────────────────────────────
export type RequestUnitDTO = z.infer<typeof RequestUnitSchema>;
export type UpdateUnitDTO = Partial<RequestUnitDTO>;
export type QueryUnitDTO = z.infer<typeof QueryUnitSchema>;
export type ResponseUnitDTO = z.infer<typeof ResponseUnitSchema>;

// Backward-compatible alias
export type UnitResponseDTO = ResponseUnitDTO;
