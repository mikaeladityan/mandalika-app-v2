import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { ResponseIssuanceImportDTO, IssuanceImportPreviewDTO } from "./import.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/product-issuance/import`;

export class IssuanceImportService {
    static async preview(file: File): Promise<ResponseIssuanceImportDTO> {
        await setupCSRFToken();

        const form = new FormData();
        form.append("file", file);

        const { data } = await api.post<ApiSuccessResponse<ResponseIssuanceImportDTO>>(
            `${API}/preview`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } },
        );

        return data.data;
    }

    static async getPreview(importId: string) {
        const { data } = await api.get<
            ApiSuccessResponse<{
                rows: IssuanceImportPreviewDTO[];
                total: number;
                valid: number;
                invalid: number;
            }>
        >(`${API}/preview/${importId}`);

        return data.data;
    }

    static async execute(importId: string, month: number, year: number, type: string) {
        await setupCSRFToken();

        const { data } = await api.post(`${API}/execute`, {
            import_id: importId,
            month,
            year,
            type,
        });

        return data.data;
    }
}
