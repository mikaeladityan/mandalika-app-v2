import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryReturnDTO, RequestReturnDTO, ResponseReturnDTO, UpdateReturnStatusDTO } from "./return.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/inventory-v2/return`;

export class ReturnService {
    static async list(params: QueryReturnDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: ResponseReturnDTO[]; len: number }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseReturnDTO>>(
                `${API}/${id}`
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(payload: RequestReturnDTO) {
        try {
            const { data } = await api.post<ApiSuccessResponse<ResponseReturnDTO>>(
                API,
                payload
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(id: number, payload: UpdateReturnStatusDTO) {
        try {
            const { data } = await api.patch<ApiSuccessResponse<ResponseReturnDTO>>(
                `${API}/${id}/status`,
                payload
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
