import { api, setupCSRFToken } from "@/lib/api";
import {
    QueryRawMatCategoryDTO,
    RequestRawMatCategoryDTO,
    ResponseRawMatCategoryDTO,
} from "./category.schema";
import { ApiSuccessResponse } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/rawmat/categories`;

export class CategoryService {
    static async create(body: RequestRawMatCategoryDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestRawMatCategoryDTO>) {
        try {
            await setupCSRFToken();
            await api.put(`${API}/${id}`, body);
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryRawMatCategoryDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseRawMatCategoryDTO> }>
            >(API, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseRawMatCategoryDTO>>(
                `${API}/${id}`,
            );

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
