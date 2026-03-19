import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import {
    QueryOutletInventoryDTO,
    RequestOutletInventoryInitDTO,
    RequestOutletInventorySetMinStockDTO,
} from "./outlet-inventory.schema";
import { OutletInventoryService } from "./outlet-inventory.service";

export function useOutletInventories(outletId: number, params: QueryOutletInventoryDTO) {
    return useQuery({
        queryKey: ["outlets", outletId, "inventories", params],
        queryFn: () => OutletInventoryService.list(outletId, params),
        enabled: !!outletId && !!params,
    });
}

export function useActionOutletInventory(outletId: number) {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const init = useMutation<unknown, ResponseError, RequestOutletInventoryInitDTO>({
        mutationKey: ["outlets", outletId, "inventories", "init"],
        mutationFn: (body) => OutletInventoryService.init(outletId, body),
        onSuccess: (data: any) => {
            setNotif({
                title: "Inisialisasi Produk",
                message: `Berhasil mendaftarkan ${data.initialized} produk baru ke outlet`,
            });
            queryClient.invalidateQueries({ queryKey: ["outlets", outletId, "inventories"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const setMinStock = useMutation<
        unknown,
        ResponseError,
        { productId: number; body: RequestOutletInventorySetMinStockDTO }
    >({
        mutationKey: ["outlets", outletId, "inventories", "setMinStock"],
        mutationFn: ({ productId, body }) => OutletInventoryService.setMinStock(outletId, productId, body),
        onSuccess: () => {
            setNotif({
                title: "Stok Minimum",
                message: "Batas stok minimum berhasil diperbarui",
            });
            queryClient.invalidateQueries({ queryKey: ["outlets", outletId, "inventories"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { init, setMinStock };
}

export function useOutletInventoryTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    /* ================= SEARCH ================= */
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    /* ================= SORT ================= */
    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "asc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    /* ================= LOW STOCK ================= */
    const lowStock = get("low_stock");
    const setLowStock = (val?: "true" | "false") => batchSet({ low_stock: val, page: "1" });

    /* ================= PAGINATION ================= */
    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    /* ================= QUERY PARAMS ================= */
    const queryParams = useMemo<QueryOutletInventoryDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ?? undefined,
            low_stock: (get("low_stock") as any) ?? undefined,
            sortBy: sortBy as QueryOutletInventoryDTO["sortBy"],
            sortOrder: sortOrder as QueryOutletInventoryDTO["sortOrder"],
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        lowStock,
        setLowStock,
        setPage,
        setPageSize,
        queryParams,
    };
}
