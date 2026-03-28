import { api, setupCSRFToken } from "@/lib/api";
import { QueryConsolidationDTO, ConsolidationResponse, ConsolidationSummaryResponse } from "./consolidation.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/consolidation`;

export class ConsolidationService {
    static async list(query: QueryConsolidationDTO) {
        try {
            const { data } = await api.get(API, { params: query });
            return data.data as { data: ConsolidationResponse[]; len: number };
        } catch (error) {
            throw error;
        }
    }

    static async getSummary(query: QueryConsolidationDTO) {
        try {
            const { data } = await api.get(`${API}/summary`, { params: query });
            return data.data as ConsolidationSummaryResponse[];
        } catch (error) {
            throw error;
        }
    }

    static async export(query: QueryConsolidationDTO) {
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
