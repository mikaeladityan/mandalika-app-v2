import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryProductStockDTO, ResponseProductStockDTO } from "./product.stock.schema";
const API = `${process.env.NEXT_PUBLIC_API}/api/app/products/stocks`;

export class ProductStockService {
    static async list(params: QueryProductStockDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    len: number;
                    data: Array<ResponseProductStockDTO>;
                    month: number;
                    year: number;
                }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async listWarehouses() {
        try {
            const { data } = await api.get<ApiSuccessResponse<Array<{ id: number; name: string }>>>(
                `${API}/warehouses`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
