import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryForecastPercentageDTO,
    RequestForecastPercentageBulkDTO,
    RequestForecastPercentageDTO,
    ResponseForecastPercentageDTO,
} from "./percentages.schema";

const API = "/api/app/forecasts/forecast-percentages";

export class ForecastPercentageService {
    static async getList(params?: QueryForecastPercentageDTO) {
        const { data } = await api.get<
            ApiSuccessResponse<{
                len: number;
                data: ResponseForecastPercentageDTO[];
            }>
        >(API, { params });
        return data.data;
    }

    static async getDetail(id: number) {
        const { data } = await api.get<ApiSuccessResponse<ResponseForecastPercentageDTO>>(
            `${API}/${id}`,
        );
        return data.data;
    }

    static async create(body: RequestForecastPercentageDTO) {
        await setupCSRFToken();
        const { data } = await api.post<ApiSuccessResponse<ResponseForecastPercentageDTO>>(
            API,
            body,
        );
        return data.data;
    }

    static async update(id: number, body: Partial<RequestForecastPercentageDTO>) {
        await setupCSRFToken();
        const { data } = await api.put<ApiSuccessResponse<ResponseForecastPercentageDTO>>(
            `${API}/${id}`,
            body,
        );
        return data.data;
    }

    static async destroy(id: number) {
        await setupCSRFToken();
        const { data } = await api.delete<ApiSuccessResponse<{ message: string }>>(`${API}/${id}`);
        return data.data;
    }

    static async createBulk(body: RequestForecastPercentageBulkDTO) {
        await setupCSRFToken();
        const { data } = await api.post<ApiSuccessResponse<{ count: number }>>(`${API}/bulk`, body);
        return data.data;
    }

    static async destroyBulk(ids: number[]) {
        await setupCSRFToken();
        const { data } = await api.delete<ApiSuccessResponse<{ count: number }>>(`${API}/bulk`, {
            data: { ids },
        });
        return data.data;
    }
}

export const forecastPercentageService = ForecastPercentageService;
