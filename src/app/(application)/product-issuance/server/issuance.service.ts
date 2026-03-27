import { api, setupCSRFToken } from "@/lib/api";
import { QueryIssuanceDTO, RequestIssuanceDTO, ResponseIssuanceDTO, IssuanceListItemDTO, QueryIssuanceRekapDTO, IssuanceRekapListItemDTO } from "./issuance.schema";
import { ApiSuccessResponse, RedisProduct } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/product-issuance`;

export type QueryDetailIssuance = {
    product_id: number;
    year: number;
    month: number;
    type?: string;
};

export class IssuanceService {
    static async detail(query: QueryDetailIssuance) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseIssuanceDTO>>(
                `${API}/${query.product_id}?month=${query.month}&year=${query.year}&type=${query.type ?? "ALL"}`,
            );

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryIssuanceDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    issuances: Array<IssuanceListItemDTO>;
                    len: number;
                }>
            >(API, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestIssuanceDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body, {
                timeout: 100000,
            });
        } catch (error) {
            throw error;
        }
    }

    static async update(body: RequestIssuanceDTO) {
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
    static async rekap(params: QueryIssuanceRekapDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    rekap: Array<IssuanceRekapListItemDTO>;
                    len: number;
                }>
            >(`${API}/rekap`, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
