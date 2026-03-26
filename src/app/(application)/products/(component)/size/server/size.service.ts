import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QuerySizeDTO, RequestSizeDTO, ResponseSizeDTO, UpdateSizeDTO } from "./size.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/products/sizes`;

export class SizeService {
    static async list(query?: QuerySizeDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<ResponseSizeDTO>; len: number }>
            >(API, { params: query });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestSizeDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseSizeDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: UpdateSizeDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<ResponseSizeDTO>>(
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
