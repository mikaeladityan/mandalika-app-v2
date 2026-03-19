import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryRecomendationV2DTO,
    RecomendationV2Response,
    RequestApproveWorkOrderDTO,
    RequestSaveWorkOrderDTO,
    RequestBulkSaveHorizonDTO,
} from "./recomendation-v2.schema";

export class RecomendationV2Service {
    static async list(params: QueryRecomendationV2DTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    data: Array<RecomendationV2Response>;
                    len: number;
                    periods: {
                        sales_periods: { month: number; year: number; key: string }[];
                        forecast_periods: { month: number; year: number; key: string }[];
                        po_periods: { month: number; year: number; key: string }[];
                    };
                }>
            >(`${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2`, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async saveWorkOrder(body: RequestSaveWorkOrderDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<any>>(
                `${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2/order`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async approveWorkOrder(body: RequestApproveWorkOrderDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<any>>(
                `${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2/approve`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async destroyWorkOrder(id: number) {
        try {
            await setupCSRFToken();
            const { data } = await api.delete<ApiSuccessResponse<any>>(
                `${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2/${id}`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async export(params: QueryRecomendationV2DTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.get(
                `${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2/export`,
                {
                    params,
                    responseType: "blob",
                },
            );
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async bulkSaveHorizon(body: RequestBulkSaveHorizonDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<any>>(
                `${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2/bulk-horizon`,
                body,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
