import { useQuery } from "@tanstack/react-query";
import { QueryStockLocationDTO } from "./stock-location.schema";
import { StockLocationService } from "./stock-location.service";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useProductStockLocations(params: QueryStockLocationDTO) {
    return useQuery({
        queryKey: ["products", "stock-locations", params],
        queryFn: () => StockLocationService.list(params),
        enabled: !!params,
    });
}

export function useStockLocationTableState() {
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

    const onSort = (key: string) => {
        const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
        batchSet({
            sortBy: key,
            sortOrder: nextOrder,
            page: "1",
        });
    };

    const type_id = get("type_id") ? Number(get("type_id")) : undefined;
    const gender = get("gender") ?? undefined;

    const setType = (value?: number) =>
        batchSet({
            type_id: value ? String(value) : undefined,
            page: "1",
        });

    const setGender = (value?: string) =>
        batchSet({
            gender: value || undefined,
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
    const queryParams = useMemo<QueryStockLocationDTO>(
        () => ({
            take: Number(get("take") ?? 50),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryStockLocationDTO["sortBy"],
            sortOrder: sortOrder as QueryStockLocationDTO["sortOrder"],
            type_id,
            gender,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        type_id,
        setType,
        gender,
        setGender,
        queryParams,
        setPage,
        setPageSize,
    };
}

export function useLocationsQuery() {
    const query = useQuery({
        queryKey: ["products", "stock-locations", "all-locations"],
        queryFn: () => StockLocationService.listLocations(),
        staleTime: Infinity,
    });

    return {
        ...query,
        locations: query.data ?? [],
    };
}
