import { api, setupCSRFToken } from "@/lib/api";
import { Eye, AlertTriangle } from "lucide-react";
import {
    RequestTransferGudangDTO,
    QueryTransferGudangDTO,
    UpdateTransferGudangStatusDTO,
    ResponseTransferGudangDTO,
} from "./tg.schema";
const API = `${process.env.NEXT_PUBLIC_API}/api/app/inventory-v2/tg`;
export class TransferGudangService {
    static async list(params: QueryTransferGudangDTO) {
        const response = await api.get<{
            data: { data: ResponseTransferGudangDTO[]; len: number };
        }>(API, { params });
        return {
            data: response.data.data.data,
            total: response.data.data.len ?? 0,
        };
    }

    static async detail(id: number) {
        const response = await api.get<{ data: ResponseTransferGudangDTO }>(API + "/" + id);
        return response.data.data;
    }

    static async create(body: RequestTransferGudangDTO) {
        await setupCSRFToken();
        const response = await api.post<{ data: ResponseTransferGudangDTO }>(API, body);
        return response.data.data;
    }

    static async updateStatus(id: number, body: UpdateTransferGudangStatusDTO) {
        await setupCSRFToken();
        const response = await api.patch<{ data: ResponseTransferGudangDTO }>(`${API}/${id}/status`, body);
        return response.data.data;
    }

    static async getStock(warehouse_id?: number, product_id?: number) {
        const response = await api.get<{ data: { stock: number } }>(`${API}/stock`, {
            params: { warehouse_id, product_id },
        });
        return response.data.data.stock;
    }

    static async export(params: QueryTransferGudangDTO) {
        const response = await api.get(`${API}/export`, {
            params,
            responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `TransferGudang_${new Date().getTime()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}
