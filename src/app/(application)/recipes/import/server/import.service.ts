import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { RecipeImportPreviewDTO, ResponseRecipeImportDTO } from "./import.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/recipes/import`;

export class RecipeImportService {
    static async preview(file: File): Promise<ResponseRecipeImportDTO> {
        await setupCSRFToken();

        const form = new FormData();
        form.append("file", file);

        const { data } = await api.post<ApiSuccessResponse<ResponseRecipeImportDTO>>(
            `${API}/preview`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } },
        );

        return data.data;
    }

    static async getPreview(importId: string) {
        const { data } = await api.get<
            ApiSuccessResponse<{
                rows: RecipeImportPreviewDTO[];
                total: number;
                valid: number;
                invalid: number;
            }>
        >(`${API}/preview/${importId}`);

        return data.data;
    }

    static async execute(importId: string) {
        await setupCSRFToken();

        const { data } = await api.post(`${API}/execute`, {
            import_id: importId,
        });

        return data.data;
    }
}
