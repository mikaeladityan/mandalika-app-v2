import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { OutletImportPreviewDTO, ResponseOutletImportDTO } from "./import.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/outlets/import`;

export class OutletImportService {
    static async preview(file: File): Promise<ResponseOutletImportDTO> {
        await setupCSRFToken();

        const form = new FormData();
        form.append("file", file);

        const { data } = await api.post<ApiSuccessResponse<ResponseOutletImportDTO>>(
            `${API}/preview`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } },
        );

        return data.data;
    }

    static async getPreview(importId: string) {
        const { data } = await api.get<
            ApiSuccessResponse<{
                rows: OutletImportPreviewDTO[];
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
