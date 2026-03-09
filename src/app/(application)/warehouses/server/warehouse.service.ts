import { api, setupCSRFToken } from "@/lib/api";
import {
    QueryProductInventoryDTO,
    RequestWarehouseDTO,
    ResponseWarehouseDTO,
} from "./warehouse.schema";
import { ApiSuccessResponse, StatusEnumDTO } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/warehouses`;

export class WarehouseService {
    static async create(body: RequestWarehouseDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<{ name: string }>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestWarehouseDTO>) {
        try {
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<{ name: string }>>(
                `${API}/${id}`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async changeStatus(id: number, status: StatusEnumDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<{ name: string }>>(`${API}/${id}`, {
                status,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryProductInventoryDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    data: Array<Omit<ResponseWarehouseDTO, "warehouse_address">>;
                    len: number;
                    month: number;
                    year: number;
                }>
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
                    Omit<ResponseWarehouseDTO, "product_inventories" | "raw_material_inventories">
                >
            >(`${API}/${id}`);

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleted(id: number) {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async detailWithStock(id: number, params: QueryProductInventoryDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<ResponseWarehouseDTO & { month: number; year: number }>
            >(`${API}/${id}/stock`, { params });

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
