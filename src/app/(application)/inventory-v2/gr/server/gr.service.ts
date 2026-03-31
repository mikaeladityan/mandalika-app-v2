import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { GoodsReceiptDTO, QueryGoodsReceiptDTO, CreateGoodsReceiptDTO } from "./gr.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/inventory-v2/gr`;

export class GoodsReceiptService {
    static async list(params: QueryGoodsReceiptDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<GoodsReceiptDTO> }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<GoodsReceiptDTO>>(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: CreateGoodsReceiptDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<GoodsReceiptDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async post(id: number) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<GoodsReceiptDTO>>(`${API}/${id}/post`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async cancel(id: number) {
        try {
            await setupCSRFToken();
            const { data } = await api.patch<ApiSuccessResponse<GoodsReceiptDTO>>(`${API}/${id}/cancel`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
