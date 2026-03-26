import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryOutletInventoryDTO,
    RequestOutletInventoryInitDTO,
    RequestOutletInventorySetMinStockDTO,
    ResponseOutletInventoryDTO,
} from "./outlet-inventory.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/outlets`;

export class OutletInventoryService {
    static async list(outletId: number, params: QueryOutletInventoryDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseOutletInventoryDTO> }>
            >(`${API}/${outletId}/inventory`, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(outletId: number, productId: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseOutletInventoryDTO>>(
                `${API}/${outletId}/inventory/${productId}`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async init(outletId: number, body: RequestOutletInventoryInitDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<
                ApiSuccessResponse<{ initialized: number; total: number }>
            >(`${API}/${outletId}/inventory/init`, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async setMinStock(
        outletId: number,
        productId: number,
        body: RequestOutletInventorySetMinStockDTO,
    ) {
        try {
            await setupCSRFToken();
            const { data } = await api.patch<ApiSuccessResponse<ResponseOutletInventoryDTO>>(
                `${API}/${outletId}/inventory/${productId}/min-stock`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
