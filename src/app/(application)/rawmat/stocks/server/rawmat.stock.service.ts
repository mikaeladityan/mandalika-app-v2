import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryRawMatStockDTO, ResponseRawMatStockDTO } from "./rawmat.stock.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/rawmat/stocks`;

export class RawMatStockService {
    static async list(params: QueryRawMatStockDTO) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) queryParams.append(key, String(value));
        }
        const { data } = await api.get<
            ApiSuccessResponse<{
                data: ResponseRawMatStockDTO[];
                len: number;
                month: number;
                year: number;
            }>
        >(`${API}?${queryParams}`);

        return data.data;
    }
}
