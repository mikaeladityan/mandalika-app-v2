import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RawMaterialStockService } from "./rawmat.stock.service";
import { QueryRawMaterialStockDTO } from "./rawmat.stock.schema";
import { useDebounce, useQueryParams } from "@/shared/hooks";

export function useRawMaterialStockTableState() {
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
    const supplier_id = get("supplier_id") ? Number(get("supplier_id")) : undefined;
    const warehouse_id = get("warehouse_id") ? Number(get("warehouse_id")) : undefined;

    const setCategory = (val?: number) =>
        batchSet({ category_id: val ? String(val) : undefined, page: "1" });
    const setSupplier = (val?: number) =>
        batchSet({ supplier_id: val ? String(val) : undefined, page: "1" });
    const setWarehouse = (val?: number) =>
        batchSet({ warehouse_id: val ? String(val) : undefined, page: "1" });

    const month = get("month") ? Number(get("month")) : undefined;
    const year = get("year") ? Number(get("year")) : undefined;

    const setMonth = (val: number) => batchSet({ month: String(val), page: "1" });
    const setYear = (val: number) => batchSet({ year: String(val), page: "1" });

    const setPage = (val: number) => batchSet({ page: String(val) });
    const setPageSize = (val: number) => batchSet({ take: String(val), page: "1" });

    const queryParams = useMemo<QueryRawMaterialStockDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 50),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryRawMaterialStockDTO["sortBy"],
            sortOrder,
            category_id,
            supplier_id,
            warehouse_id,
            month,
            year,
        }),
        [searchParams],
    );

    return {
        queryParams,
        search,
        setSearch,
        onSort,
        sortBy,
        sortOrder,
        category_id,
        setCategory,
        supplier_id,
        setSupplier,
        warehouse_id,
        setWarehouse,
        month,
        setMonth,
        year,
        setYear,
        setPage,
        setPageSize,
    };
}

export function useRawMaterialStocksQuery(params: QueryRawMaterialStockDTO) {
    const query = useQuery({
        queryKey: ["raw-materials", "stocks", params],
        queryFn: () => RawMaterialStockService.list(params),
        enabled: !!params,
    });

    return {
        ...query,
        rawMaterials: query.data?.data ?? [],
        total: query.data?.len ?? 0,
        month: query.data?.month,
        year: query.data?.year,
        meta: query.data,
    };
}

export function useRawMaterialStockWarehouses() {
    const query = useQuery({
        queryKey: ["raw-materials", "stocks", "warehouses"],
        queryFn: () => RawMaterialStockService.listWarehouses(),
        staleTime: Infinity,
    });

    return {
        ...query,
        warehouses: query.data ?? [],
    };
}
