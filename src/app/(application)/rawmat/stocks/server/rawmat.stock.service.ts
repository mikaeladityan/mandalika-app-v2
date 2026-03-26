import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryRawMaterialStockDTO, ResponseRawMaterialStockDTO } from "./rawmat.stock.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/rawmat/stocks`;

export class RawMaterialStockService {
    static async list(params: QueryRawMaterialStockDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    data: Array<ResponseRawMaterialStockDTO>;
                    len: number;
                    month: number;
                    year: number;
                }>
            >(API, {
                params,
            });
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
