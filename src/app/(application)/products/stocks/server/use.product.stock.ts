import { useQuery } from "@tanstack/react-query";
import { QueryProductStockDTO } from "./product.stock.schema";
import { ProductStockService } from "./product.stock.service";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenderEnumDTO } from "@/shared/types";

export function useProductStock(params: QueryProductStockDTO) {
    return useQuery({
        queryKey: ["products", "stocks", params],
        queryFn: () => ProductStockService.list(params),
        enabled: !!params,
    });
}

export function useProductStockTableState() {
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

    const gender = get("gender") as QueryProductStockDTO["gender"];
    const setGender = (value?: GenderEnumDTO) =>
        batchSet({
            gender: value ? String(value) : undefined,
            page: "1",
        });

    const type_id = get("type_id") ? Number(get("type_id")) : undefined;
    const warehouse_id = get("warehouse_id") ? Number(get("warehouse_id")) : undefined;
    const setWarehouse = (value?: number) =>
        batchSet({
            warehouse_id: value ? String(value) : undefined,
            page: "1",
        });

    const setType = (value?: number) =>
        batchSet({
            type_id: value ? String(value) : undefined,
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
    const queryParams = useMemo<QueryProductStockDTO>(
        () => ({
            take: Number(get("take") ?? 50),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryProductStockDTO["sortBy"],
            sortOrder,
            gender,
            type_id,
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
        gender,
        setGender,
        type_id,
        warehouse_id,
        setWarehouse,
        setType,
        month,
        setMonth,
        year,
        setYear,
        queryParams,
        setPage,
        setPageSize,
    };
}

export function useProductStocksQuery(params: QueryProductStockDTO) {
    const query = useProductStock(params);

    return {
        products: query.data?.data ?? [],
        month: query.data?.month,
        year: query.data?.year,
        total: query.data?.len ?? 0,
        meta: query.data,
        ...query,
    };
}

export function useProductStockWarehouses() {
    const query = useQuery({
        queryKey: ["products", "stocks", "warehouses"],
        queryFn: () => ProductStockService.listWarehouses(),
        staleTime: Infinity,
    });

    return {
        ...query,
        warehouses: query.data ?? [],
    };
}
