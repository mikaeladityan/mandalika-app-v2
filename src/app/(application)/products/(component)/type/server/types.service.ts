import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryTypeDTO, RequestTypeDTO, ResponseTypeDTO, UpdateTypeDTO } from "./type.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/products/types`;

export class TypeService {
    static async list(query?: QueryTypeDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<ResponseTypeDTO>; len: number }>
            >(API, { params: query });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestTypeDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseTypeDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: UpdateTypeDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<ResponseTypeDTO>>(
                `${API}/${id}`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/${id}`);
        } catch (error) {
            throw error;
        }
    }
}
