import { api, setupCSRFToken } from "@/lib/api";
import { QuerySalesDTO, RequestSalesDTO, ResponseSalesDTO, SalesListItemDTO, QuerySalesRekapDTO, SalesRekapListItemDTO } from "./sales.schema";
import { ApiSuccessResponse, RedisProduct } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/sales`;

export type QueryDetailSale = {
    product_id: number;
    year: number;
    month: number;
    type?: string;
};

export class SalesService {
    static async detail(query: QueryDetailSale) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseSalesDTO>>(
                `${API}/${query.product_id}?month=${query.month}&year=${query.year}&type=${query.type ?? "ALL"}`,
            );

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QuerySalesDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    sales: Array<SalesListItemDTO>;
                    len: number;
                }>
            >(API, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestSalesDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body, {
                timeout: 100000,
            });
        } catch (error) {
            throw error;
        }
    }

    static async update(body: RequestSalesDTO) {
        try {
            await setupCSRFToken();
            await api.put(API, body, {
                timeout: 100000,
            });
        } catch (error) {
            throw error;
        }
    }

    static async getProductOptions() {
        try {
            const { data } = await api.get<ApiSuccessResponse<Array<RedisProduct>>>(
                `${process.env.NEXT_PUBLIC_API}/api/app/products/redis`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
    static async rekap(params: QuerySalesRekapDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    rekap: Array<SalesRekapListItemDTO>;
                    len: number;
                }>
            >(`${API}/rekap`, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
