import { api, setupCSRFToken } from "@/lib/api";
import { QuerySupplierDTO, RequestSupplierDTO, ResponseSupplierDTO } from "./supplier.schema";
import { ApiSuccessResponse } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/rawmat/suppliers`;

export class SupplierService {
    static async create(body: RequestSupplierDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestSupplierDTO>) {
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

    static async list(params: QuerySupplierDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseSupplierDTO> }>
            >(API, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseSupplierDTO>>(`${API}/${id}`);

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
