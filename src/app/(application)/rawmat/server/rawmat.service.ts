import { api, setupCSRFToken } from "@/lib/api";
import {
    QueryRawMaterialDTO,
    RequestRawMaterialDTO,
    ResponseCountUtils,
    ResponseRawMaterialDTO,
    ResponseUtils,
} from "./rawmat.schema";
import { ApiSuccessResponse } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/rawmat`;

export class RawMatService {
    static async create(body: RequestRawMaterialDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseRawMaterialDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestRawMaterialDTO>) {
        try {
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<ResponseRawMaterialDTO>>(
                `${API}/${id}`,
                body,
            );

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async partialUpdate(id: number, body: Partial<RequestRawMaterialDTO>) {
        try {
            await setupCSRFToken();
            const { data } = await api.patch<ApiSuccessResponse<ResponseRawMaterialDTO>>(
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

    static async list(params: QueryRawMaterialDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseRawMaterialDTO> }>
            >(API, {
                params,
            });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseRawMaterialDTO>>(
                `${API}/${id}`,
            );

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async restore(id: number) {
        try {
            await setupCSRFToken();
            await api.patch(`${API}/${id}/restore`);
        } catch (error) {
            throw error;
        }
    }

    static async clean() {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/clean`);
        } catch (error) {
            throw error;
        }
    }

    static async getUtils() {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseUtils>>(`${API}/utils`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async countUtils() {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseCountUtils>>(
                `${API}/count-utils`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
