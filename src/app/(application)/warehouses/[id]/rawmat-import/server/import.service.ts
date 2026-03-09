import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    RawMaterialInventoryImportPreviewDTO,
    ResponseRawMaterialInventoryImportDTO,
} from "./import.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/warehouses/rawmaterial/import`;

export class RawMaterialInventoryImportService {
    static async preview(file: File): Promise<ResponseRawMaterialInventoryImportDTO> {
        await setupCSRFToken();

        const form = new FormData();
        form.append("file", file);

        const { data } = await api.post<ApiSuccessResponse<ResponseRawMaterialInventoryImportDTO>>(
            `${API}/preview`,
            form,

            { headers: { "Content-Type": "multipart/form-data" }, timeout: 500000 },
        );

        return data.data;
    }

    static async getPreview(importId: string) {
        const { data } = await api.get<
            ApiSuccessResponse<{
                rows: RawMaterialInventoryImportPreviewDTO[];
                total: number;
                valid: number;
                invalid: number;
            }>
        >(`${API}/preview/${importId}`);

        return data.data;
    }

    static async execute(
        importId: string,
        warehouseId: number,
        date: number,
        month: number,
        year: number,
    ) {
        await setupCSRFToken();

        const { data } = await api.post(`${API}/execute`, {
            import_id: importId,
            warehouse_id: warehouseId,
            date,
            month,
            year,
        });

        return data.data;
    }
}
