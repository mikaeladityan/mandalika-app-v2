import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryStockTransferDTO,
    RequestStockTransferDTO,
    RequestUpdateStockTransferStatusDTO,
    ResponseStockTransferDTO,
} from "./stock-transfer.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/stock-transfers`;

export class StockTransferService {
    static async create(body: RequestStockTransferDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseStockTransferDTO>>(
                API,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(id: number, body: RequestUpdateStockTransferStatusDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.patch<ApiSuccessResponse<ResponseStockTransferDTO>>(
                `${API}/${id}/status`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryStockTransferDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseStockTransferDTO> }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseStockTransferDTO>>(
                `${API}/${id}`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
