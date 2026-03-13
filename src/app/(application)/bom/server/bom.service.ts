import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryBOMDTO, ResponseBOMDTO, ResponseBOMListDTO } from "./bom.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/bom`;

class BOMService {
    async list(params: QueryBOMDTO) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseBOMListDTO>>(API, {
                params,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async detail(id: number | string, params?: { month?: number; year?: number }) {
        try {
            const { data } = await api.get<ApiSuccessResponse<any>>(`${API}/${id}`, {
                params,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}

export const bomService = new BOMService();
