import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { QueryRecomendationV2DTO } from "./recomendation-v2.schema";
import { RecomendationV2Service } from "./recomendation-v2.service";

export function useRecomendationV2(params: QueryRecomendationV2DTO) {
    const list = useQuery({
        queryKey: ["recomendation-v2", params],
        queryFn: () => RecomendationV2Service.list(params),
    });

    return { list };
}

export function useRecomendationV2TableState(initial?: { defaultType?: "ffo" | "lokal" | "impor" }) {
    const [page, setPage] = useState(1);
    const [take, setTake] = useState(25);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [type, setType] = useState<"ffo" | "lokal" | "impor" | undefined>(initial?.defaultType);
    const [salesMonths, setSalesMonths] = useState(3);
    const [forecastMonths, setForecastMonths] = useState(3);

    const queryParams: QueryRecomendationV2DTO = {
        page,
        take,
        search: debouncedSearch,
        month,
        year,
        type,
        sales_months: salesMonths,
        forecast_months: forecastMonths,
    };

    const reset = () => {
        setPage(1);
        setSearch("");
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSalesMonths(3);
        setForecastMonths(3);
    };

    return {
        page,
        setPage,
        take,
        setTake,
        search,
        setSearch,
        month,
        setMonth,
        year,
        setYear,
        type,
        setType,
        salesMonths,
        setSalesMonths,
        forecastMonths,
        setForecastMonths,
        queryParams,
        reset,
    };
}
