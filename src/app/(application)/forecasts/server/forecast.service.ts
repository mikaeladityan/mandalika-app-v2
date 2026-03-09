import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryForecastDTO,
    RequestAddRatioForecastDTO,
    RequestForecastDTO,
    RequestReconcileDTO,
    ResponseForecastDTO,
} from "./forecast.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/forecasts`;

class ForecastService {
    async list(params: QueryForecastDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ len: number; data: Array<ResponseForecastDTO> }>
            >(API, {
                params,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async getStatusJob(jobId: string) {
        try {
            const { data } = await api.get<ApiSuccessResponse<any>>(`${API}/job/${jobId}`, {
                timeout: 100000,
            });

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async generateForecast(body: Omit<RequestForecastDTO, "product_id" | "preview">) {
        try {
            await setupCSRFToken();
            const { data } = await api.post(`${API}/generate-all`, body, {
                timeout: 100000,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async generateBaseForecast(body: RequestForecastDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post(API, body, {
                timeout: 100000,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async addRatio(data: RequestAddRatioForecastDTO) {
        try {
            await setupCSRFToken();
            await api.post(`${API}/add-ratio`, data, {
                timeout: 100000,
            });
        } catch (error) {
            throw error;
        }
    }

    async reconcileForecast(data: RequestReconcileDTO) {
        try {
            await setupCSRFToken();
            await api.post(`${API}/reconcile`, data);
        } catch (error) {
            throw error;
        }
    }
}

export const forecastService = new ForecastService();
