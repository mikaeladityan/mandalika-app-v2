import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    RequestDeliveryOrderDTO,
    UpdateDeliveryOrderStatusDTO,
    ResponseDeliveryOrderDTO,
    QueryDeliveryOrderDTO,
} from "./do.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/inventory-v2/do`;

export class DeliveryOrderService {
    static async list(params: QueryDeliveryOrderDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseDeliveryOrderDTO> }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseDeliveryOrderDTO>>(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async create(body: RequestDeliveryOrderDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseDeliveryOrderDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(id: number, body: UpdateDeliveryOrderStatusDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.patch<ApiSuccessResponse<ResponseDeliveryOrderDTO>>(`${API}/${id}/status`, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async export(params: QueryDeliveryOrderDTO) {
        try {
            const response = await api.get(`${API}/export`, {
                params,
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Data_Delivery_Orders.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            throw error;
        }
    }

    static async exportDetail(id: number, transferNumber: string) {
        try {
            const response = await api.get(`${API}/${id}/export`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Delivery_Order_${transferNumber}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            throw error;
        }
    }

    static async getStock(warehouse_id?: number, product_id?: number, outlet_id?: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<{ stock: number }>>(`${API}/stock`, {
                params: { warehouse_id, product_id, outlet_id }
            });
            return data.data.stock;
        } catch (error) {
            throw error;
        }
    }
}
