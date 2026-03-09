import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { ProductImportPreviewDTO, ResponseProductImportDTO } from "./import.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/products/import`;

export class ProductImportService {
    static async preview(file: File): Promise<ResponseProductImportDTO> {
        await setupCSRFToken();

        const form = new FormData();
        form.append("file", file);

        const { data } = await api.post<ApiSuccessResponse<ResponseProductImportDTO>>(
            `${API}/preview`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } },
        );

        return data.data;
    }

    static async getPreview(importId: string) {
        const { data } = await api.get<
            ApiSuccessResponse<{
                rows: ProductImportPreviewDTO[];
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
