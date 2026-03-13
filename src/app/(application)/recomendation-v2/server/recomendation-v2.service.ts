import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryRecomendationV2DTO, RecomendationV2Response } from "./recomendation-v2.schema";

export class RecomendationV2Service {
    static async list(params: QueryRecomendationV2DTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<RecomendationV2Response>; meta: any }>
            >(`${process.env.NEXT_PUBLIC_API}/api/app/recomendations-v2`, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
