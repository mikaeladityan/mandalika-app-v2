import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forecastService } from "./forecast.service";
import { QueryForecastDTO, RunForecastDTO } from "./forecast.schema";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";

export function useForecast(params?: QueryForecastDTO) {
    const list = useQuery({
        queryKey: ["forecast", params],
        queryFn: () => forecastService.list(params!),
        enabled: !!params,
    });
    return { list };
}
export function useForecastTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    /**
     * Horizon
     */
    const horizon = get("horizon") ? Number(get("horizon")) : 4;

    const setHorizon = (value: number | undefined) =>
        batchSet({
            horizon: String(value),
            page: "1",
        });

    /**
     * Pagination
     */
    const page = Number(get("page") ?? 1);
    const take = Number(get("take") ?? 100);

    const setPage = (page: number | undefined) =>
        batchSet({
            page: String(page),
        });

    const setPageSize = (take: number | undefined) =>
        batchSet({
            take: String(take),
            page: "1",
        });

    /**
     * Query DTO
     */
    const queryParams = useMemo<QueryForecastDTO>(
        () => ({
            horizon,
            page,
            take,
            search: get("search") ?? undefined,
        }),
        [searchParams],
    );

    return {
        // search
        search,
        setSearch,

        // horizon
        horizon,
        setHorizon,

        // pagination
        page,
        take,
        setPage,
        setPageSize,

        queryParams,
    };
}
export function useForecastQuery(params: QueryForecastDTO) {
    const { list } = useForecast(params);

    return {
        forecast: list.data?.data ?? [],
        len: list.data?.len ?? 0,
        meta: list.data,
        ...list,
    };
}

export function useFormForecast() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const run = useMutation<any, ResponseError, RunForecastDTO>({
        mutationKey: ["forecasting", "run"],
        mutationFn: (body) => forecastService.runForecast(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["forecast"], type: "all" });
            setNotif({
                title: "Run Forecasting Sukses",
                message: data?.message || "Berhasil memproses data forecast.",
            });
        },
    });

    return {
        run: run.mutateAsync,
        isPending: run.isPending,
    };
}
