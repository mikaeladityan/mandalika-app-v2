import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import {
    QueryStockMovementDTO,
} from "./stock-movement.schema";
import { StockMovementService } from "./stock-movement.service";

export function useStockMovements(params: QueryStockMovementDTO) {
    return useQuery({
        queryKey: ["stock-movements", params],
        queryFn: () => StockMovementService.list(params),
        enabled: !!params,
    });
}

export function useStockMovementTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    /* ================= SEARCH (Product Name/Code) ================= */
    // Note: Search actually filters by entity_id if provided from a parent, 
    // but in a global log, we might want to filter by product name if the API supports it.
    // For now, let's keep it based on query params.
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    /* ================= FILTERS ================= */
    const movementType = get("movement_type") as QueryStockMovementDTO["movement_type"];
    const locationType = get("location_type") as QueryStockMovementDTO["location_type"];
    const entityType = get("entity_type") as QueryStockMovementDTO["entity_type"];

    const setFilter = (key: string, val?: any) => batchSet({ [key]: val || undefined, page: "1" });

    /* ================= SORT ================= */
    const sortBy = get("sortBy") ?? "created_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = (key: string) => {
        const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
        batchSet({ sortBy: key, sortOrder: next, page: "1" });
    };

    /* ================= PAGINATION ================= */
    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    /* ================= QUERY PARAMS ================= */
    const queryParams = useMemo<QueryStockMovementDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 10),
            sortBy: sortBy as QueryStockMovementDTO["sortBy"],
            sortOrder: sortOrder as QueryStockMovementDTO["sortOrder"],
            movement_type: movementType || undefined,
            location_type: locationType || undefined,
            entity_type: entityType || undefined,
            location_id: get("location_id") ? Number(get("location_id")) : undefined,
            entity_id: get("entity_id") ? Number(get("entity_id")) : undefined,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        movementType,
        locationType,
        entityType,
        setFilter,
        sortBy,
        sortOrder,
        onSort,
        setPage,
        setPageSize,
        queryParams,
    };
}
