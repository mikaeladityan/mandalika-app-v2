import { api } from "@/lib/api";
import { QueryRecomendationDTO, RecomendationResponse } from "./recomendation.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/recomendations`;

export class RecomendationService {
    static async list(query: QueryRecomendationDTO) {
        const { data } = await api.get(API, { params: query });
        return data.data as {
            data: RecomendationResponse[];
            len: number;
            periods: {
                sales_periods: { month: number; year: number; period: Date | string; key: string }[];
                forecast_periods: { month: number; year: number; period: Date | string; key: string }[];
            };
        };
    }
}
