import { api, setupCSRFToken } from "@/lib/api";

import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryRawMaterialUnitDTO,
    RequestRawMaterialUnitDTO,
    ResponseRawMaterialUnitDTO,
} from "./unit.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/rawmat/units`;

export class UnitService {
    static async create(body: RequestRawMaterialUnitDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestRawMaterialUnitDTO>) {
        try {
            await setupCSRFToken();
            await api.put(`${API}/${id}`, body);
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

    static async list(params: QueryRawMaterialUnitDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseRawMaterialUnitDTO> }>
            >(API, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseRawMaterialUnitDTO>>(
                `${API}/${id}`,
            );

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
