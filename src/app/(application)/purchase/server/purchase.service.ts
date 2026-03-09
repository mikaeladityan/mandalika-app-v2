import { api } from "@/lib/api";
import { QueryPurchaseDTO, PurchaseResponse } from "./purchase.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/purchases`;

export class PurchaseService {
    static async list(query: QueryPurchaseDTO) {
        const { data } = await api.get(API, { params: query });
        return data.data as {
            data: PurchaseResponse[];
            meta: {
                total: number;
                page: number;
                take: number;
            };
        };
    }
}
