import { useQuery } from "@tanstack/react-query";
import { bomService } from "./bom.service";
import { QueryBOMDTO } from "./bom.schema";

export const useBOM = (query: QueryBOMDTO) => {
    return useQuery({
        queryKey: ["bom", query],
        queryFn: () => bomService.list(query),
        placeholderData: (previousData) => previousData,
    });
};

export const useBOMDetail = (
    id: number | string,
    params?: { month?: number; year?: number; forecast_months?: number },
) => {
    return useQuery({
        queryKey: ["bom", "detail", id, params],
        queryFn: () => bomService.detail(id, params),
        enabled: !!id,
    });
};

export const useDetailBOM = useBOMDetail;
