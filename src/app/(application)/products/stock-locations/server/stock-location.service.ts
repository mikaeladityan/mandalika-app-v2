import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryStockLocationDTO, ResponseStockLocationDTO } from "./stock-location.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/products/stock-locations`;

export class StockLocationService {
    static async list(params: QueryStockLocationDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    len: number;
                    data: Array<ResponseStockLocationDTO>;
                }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async listLocations() {
        try {
            const { data } = await api.get<ApiSuccessResponse<Array<{ id: number; name: string, type: string }>>>(
                `${API}/locations`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
