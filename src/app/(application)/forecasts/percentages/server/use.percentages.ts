import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { forecastPercentageService } from "./percentages.service";
import {
    QueryForecastPercentageDTO,
    RequestForecastPercentageBulkDTO,
    RequestForecastPercentageDTO,
} from "./percentages.schema";
import { useQueryParams } from "@/shared/hooks";
import { useMemo } from "react";

export function useForecastPercentageTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const yearRaw = get("year");
    const year = yearRaw ? Number(yearRaw) : new Date().getFullYear();
    const page = Number(get("page") ?? 1);
    const take = Number(get("take") ?? 10);

    const queryParams = useMemo(() => ({
        year,
        page,
        take,
    }), [searchParams]);

    return {
        year,
        setYear: (year: number | null) => batchSet({ year: year ? String(year) : undefined, page: "1" }),
        page,
        setPage: (page: number) => batchSet({ page: String(page) }),
        take,
        setPageSize: (take: number) => batchSet({ take: String(take), page: "1" }),
        queryParams,
    };
}

export function useForecastPercentageList(params?: QueryForecastPercentageDTO) {
    return useQuery({
        queryKey: ["forecast-percentages", params],
        queryFn: () => forecastPercentageService.getList(params),
    });
}

export function useForecastPercentageDetail(id: number) {
    return useQuery({
        queryKey: ["forecast-percentage", id],
        queryFn: () => forecastPercentageService.getDetail(id),
        enabled: !!id,
    });
}

export function useForecastPercentageMutations() {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["forecast-percentages"] });
        queryClient.invalidateQueries({ queryKey: ["forecast-percentage"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: RequestForecastPercentageDTO) => forecastPercentageService.create(data),
        onSuccess: () => {
            invalidate();
            toast.success("Forecast percentage created successfully");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<RequestForecastPercentageDTO> }) =>
            forecastPercentageService.update(id, data),
        onSuccess: () => {
            invalidate();
            toast.success("Forecast percentage updated successfully");
        },
    });

    const destroyMutation = useMutation({
        mutationFn: (id: number) => forecastPercentageService.destroy(id),
        onSuccess: () => {
            invalidate();
            toast.success("Forecast percentage deleted successfully");
        },
    });

    const createBulkMutation = useMutation({
        mutationFn: (data: RequestForecastPercentageBulkDTO) =>
            forecastPercentageService.createBulk(data),
        onSuccess: (data) => {
            invalidate();
            toast.success(`${data.count} items created/updated successfully`);
        },
    });

    const destroyBulkMutation = useMutation({
        mutationFn: (ids: number[]) => forecastPercentageService.destroyBulk(ids),
        onSuccess: (data) => {
            invalidate();
            toast.success(`${data.count} items deleted successfully`);
        },
    });

    return {
        create: createMutation,
        update: updateMutation,
        destroy: destroyMutation,
        createBulk: createBulkMutation,
        destroyBulk: destroyBulkMutation,
    };
}
