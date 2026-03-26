import { api, setupCSRFToken } from "@/lib/api";
import { RequestSyncProductionDTO } from "./production.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/productions`;

export class ProductionService {
    static async sync(body: RequestSyncProductionDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async bulk(params?: { month?: number; year?: number }) {
        try {
            await setupCSRFToken();
            await api.post(`${API}/generate-all?month=${params?.month}&year=${params?.year}`);
        } catch (error) {
            throw error;
        }
    }
}
