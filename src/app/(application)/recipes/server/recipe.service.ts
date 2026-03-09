import { api, setupCSRFToken } from "@/lib/api";
import {
    QueryRecipeDTO,
    RequestRecipeDTO,
    ResponseDetailRecipeDTO,
    ResponseRecipeDTO,
} from "./recipe.schema";
import { ApiSuccessResponse, RedisProduct, RedisRawMaterial } from "@/shared/types";
import { QueryBOMDTO, RequestBOMDTO, ResponseBOMDTO } from "../../bom/server/bom.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/recipes`;
export class RecipeService {
    static async upsert(body: RequestRecipeDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }
    static async explode(body: RequestBOMDTO) {
        try {
            await setupCSRFToken();
            await api.post(`${API}/explode`, body);
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryRecipeDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<ResponseRecipeDTO>; len: number }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(product_id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseDetailRecipeDTO>>(
                `${API}/${product_id}`,
            );
            return data.data;
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

    static async getRawMaterialOptions() {
        try {
            const { data } = await api.get<ApiSuccessResponse<Array<RedisRawMaterial>>>(
                `${process.env.NEXT_PUBLIC_API}/api/app/rawmat/redis`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async bom(params: QueryBOMDTO) {
        try {
            const { data } = await api.get<ApiSuccessResponse<{ data: Array<any>; len: number }>>(
                `${API}/bom`,
                { params },
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async explodeBom(body: RequestBOMDTO) {
        try {
            await setupCSRFToken();
            await api.post(`${API}/explode`, body, {
                timeout: 20000000,
            });
        } catch (error) {
            throw error;
        }
    }

    static async detailBOM(material_code: string, params: { year?: number; month?: number }) {
        try {
            const { data } = await api.get(`${API}/bom/${material_code}`, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
