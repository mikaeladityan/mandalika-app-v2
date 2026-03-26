import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryUnitDTO, RequestUnitDTO, ResponseUnitDTO, UpdateUnitDTO } from "./unit.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/products/units`;

export class UnitService {
    static async list(query?: QueryUnitDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<ResponseUnitDTO>; len: number }>
            >(API, { params: query });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestUnitDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseUnitDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: UpdateUnitDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<ResponseUnitDTO>>(
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
