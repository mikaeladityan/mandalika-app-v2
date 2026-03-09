import { api, setupCSRFToken } from "@/lib/api";
import { QuerySalesDTO, RequestSalesDTO, ResponseSalesDTO } from "./sales.schema";
import { ApiSuccessResponse, RedisProduct } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/sales`;
export type QueryDetailSale = {
    product_id: number;
    year: number;
    month: number;
};
export class SalesService {
    static async detail(query: QueryDetailSale) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseSalesDTO>>(
                `${API}/${query.product_id}?month=${query.month}&year=${query.year}`,
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
                    sales: Array<
                        ResponseSalesDTO & {
                            quantity: Array<{
                                year: number;
                                month: number;
                                quantity: number;
                                trend: string;
                            }>;
                        }
                    >;
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
}
