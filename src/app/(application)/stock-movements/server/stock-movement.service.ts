import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryStockMovementDTO,
    ResponseStockMovementDTO,
} from "./stock-movement.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/stock-movements`;

export class StockMovementService {
    static async list(params: QueryStockMovementDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseStockMovementDTO> }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
