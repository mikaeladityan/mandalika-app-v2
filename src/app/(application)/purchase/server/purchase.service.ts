import { api, setupCSRFToken } from "@/lib/api";
import { QueryPurchaseDTO, PurchaseResponse, PurchaseSummaryResponse } from "./purchase.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/purchases`;

export class PurchaseService {
    static async list(query: QueryPurchaseDTO) {
        try {
            const { data } = await api.get(API, { params: query });
            return data.data as { data: PurchaseResponse[]; len: number };
        } catch (error) {
            throw error;
        }
    }

    static async getSummary(query: QueryPurchaseDTO) {
        try {
            const { data } = await api.get(`${API}/summary`, { params: query });
            return data.data as PurchaseSummaryResponse[];
        } catch (error) {
            throw error;
        }
    }

    static async export(query: QueryPurchaseDTO) {
        try {
            await setupCSRFToken();
            const response = await api.get(`${API}/export`, {
                params: query,
                responseType: "blob",
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
