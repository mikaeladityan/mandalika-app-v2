import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryDiscrepancyDTO, ResponseDiscrepancyDTO } from "./discrepancy.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/inventory-v2/do/discrepancies`;

export class DiscrepancyService {
    static async list(params: QueryDiscrepancyDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: ResponseDiscrepancyDTO[]; len: number }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async export(params: QueryDiscrepancyDTO) {
        try {
            const response = await api.get(`${API}/export`, {
                params,
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Audit_Selisih_Persediaan_${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            throw error;
        }
    }
}
