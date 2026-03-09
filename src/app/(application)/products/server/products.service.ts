import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse, STATUS } from "@/shared/types";
import { QueryProductDTO, RequestProductDTO, ResponseProductDTO } from "./products.schema";
import { ResponseRecipeDTO } from "../../recipes/server/recipe.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/products`;

export class ProductService {
    static async list(params: QueryProductDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseProductDTO> }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<
                    ResponseProductDTO & {
                        recipes: Array<Pick<ResponseRecipeDTO, "quantity" | "raw_material">>;
                    }
                >
            >(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestProductDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async update(body: Partial<RequestProductDTO>, id: number) {
        try {
            await setupCSRFToken();
            await api.put(`${API}/${id}`, body);
        } catch (error) {
            throw error;
        }
    }

    // PATCH /api/app/products/status/:id?status=...
    static async changeStatus(id: number, status: (typeof STATUS)[number]) {
        try {
            await setupCSRFToken();
            await api.patch(`${API}/status/${id}`, null, { params: { status } });
        } catch (error) {
            throw error;
        }
    }

    static async clean() {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/clean`);
        } catch (error) {
            throw error;
        }
    }
}
