import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryForecastDTO,
    ResponseForecastDTO,
    RunForecastDTO,
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

    async runForecast(body: RunForecastDTO) {
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
}

export const forecastService = new ForecastService();
