import { api, setupCSRFToken } from "@/lib/api";
import {
    QueryOutletDTO,
    RequestOutletDTO,
    ResponseOutletDTO,
    UpdateOutletDTO,
} from "./outlet.schema";
import { ApiSuccessResponse } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/outlets`;

export class OutletService {
    static async create(body: RequestOutletDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseOutletDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: UpdateOutletDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<ResponseOutletDTO>>(
                `${API}/${id}`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async toggleStatus(id: number) {
        try {
            await setupCSRFToken();
            const { data } = await api.patch<ApiSuccessResponse<{ id: number; is_active: boolean }>>(
                `${API}/${id}/status`,
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

    static async list(params: QueryOutletDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseOutletDTO> }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseOutletDTO>>(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async clean() {
        try {
            await setupCSRFToken();
            const { data } = await api.delete(`${API}/clean`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
