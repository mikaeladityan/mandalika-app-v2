import { useQuery } from "@tanstack/react-query";
import { QueryRawMatStockDTO } from "./rawmat.stock.schema";
import { RawMatStockService } from "./rawmat.stock.service";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useRawMatStock(params: QueryRawMatStockDTO) {
    return useQuery({
        queryKey: ["rawmat", "stocks", params],
        queryFn: () => RawMatStockService.list(params),
        enabled: !!params,
    });
}

export function useRawMatStockTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // Search
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    // Sort
    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";

            batchSet({
                sortBy: key,
                sortOrder: nextOrder,
                page: "1",
            });
        },
        [sortBy, sortOrder],
    );

    const category_id = get("category_id") ? Number(get("category_id")) : undefined;
    const warehouse_id = get("warehouse_id") ? Number(get("warehouse_id")) : undefined;

    const setWarehouse = (value?: number) =>
        batchSet({
            warehouse_id: value ? String(value) : undefined,
            page: "1",
        });

    const setCategory = (value?: number) =>
        batchSet({
            category_id: value ? String(value) : undefined,
            page: "1",
        });

    const month = get("month") ? Number(get("month")) : undefined;
    const year = get("year") ? Number(get("year")) : undefined;

    const setMonth = (value?: number) =>
        batchSet({
            month: value ? String(value) : undefined,
            page: "1",
        });

    const setYear = (value?: number) =>
        batchSet({
            year: value ? String(value) : undefined,
            page: "1",
        });

    // Set Page
    const setPage = (page: number) => batchSet({ page: String(page) });

    const setPageSize = (take: number) =>
        batchSet({
            take: String(take),
            page: "1",
        });

    // Query DTO
    const queryParams = useMemo<QueryRawMatStockDTO>(
        () => ({
            take: Number(get("take") ?? 50),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryRawMatStockDTO["sortBy"],
            sortOrder,
            category_id,
            warehouse_id,
            month: month ?? undefined,
            year: year ?? undefined,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        category_id,
        setCategory,
        warehouse_id,
        setWarehouse,
        month,
        setMonth,
        year,
        setYear,
        queryParams,
        setPage,
        setPageSize,
    };
}

export function useRawMatStocksQuery(params: QueryRawMatStockDTO) {
    const query = useRawMatStock(params);

    return {
        rawMats: query.data?.data ?? [],
        month: query.data?.month,
        year: query.data?.year,
        total: query.data?.len ?? 0,
        meta: query.data,
        ...query,
    };
}
