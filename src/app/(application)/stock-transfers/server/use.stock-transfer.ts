import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import {
    QueryStockTransferDTO,
    RequestStockTransferDTO,
    RequestUpdateStockTransferStatusDTO,
} from "./stock-transfer.schema";
import { StockTransferService } from "./stock-transfer.service";

export function useStockTransfers(params: QueryStockTransferDTO) {
    return useQuery({
        queryKey: ["stock-transfers", params],
        queryFn: () => StockTransferService.list(params),
        enabled: !!params,
    });
}

export function useStockTransfer(id: number) {
    return useQuery({
        queryKey: ["stock-transfers", id],
        queryFn: () => StockTransferService.detail(id),
        enabled: !!id,
    });
}

export function useActionStockTransfer() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestStockTransferDTO>({
        mutationKey: ["stock-transfers", "create"],
        mutationFn: (body) => StockTransferService.create(body),
        onSuccess: (data: any) => {
            setNotif({
                title: "Stock Transfer",
                message: `Transfer ${data.transfer_number} berhasil dibuat`,
            });
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const updateStatus = useMutation<
        unknown,
        ResponseError,
        { id: number; body: RequestUpdateStockTransferStatusDTO }
    >({
        mutationKey: ["stock-transfers", "updateStatus"],
        mutationFn: ({ id, body }) => StockTransferService.updateStatus(id, body),
        onSuccess: (data: any) => {
            setNotif({
                title: "Update Status",
                message: `Status transfer ${data.transfer_number} berhasil diperbarui menjadi ${data.status}`,
            });
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
            queryClient.invalidateQueries({ queryKey: ["stock-transfers", data.id] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, updateStatus };
}

export function useStockTransferTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    /* ================= SEARCH ================= */
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    /* ================= STATUS ================= */
    const status = get("status") as QueryStockTransferDTO["status"];
    const setStatus = (val?: QueryStockTransferDTO["status"]) =>
        batchSet({ status: val || undefined, page: "1" });

    /* ================= SORT ================= */
    const sortBy = get("sortBy") ?? "created_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    /* ================= PAGINATION ================= */
    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    /* ================= QUERY PARAMS ================= */
    const queryParams = useMemo<QueryStockTransferDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 10),
            search: get("search") ?? undefined,
            status: status || undefined,
            sortBy: sortBy as QueryStockTransferDTO["sortBy"],
            sortOrder: sortOrder as QueryStockTransferDTO["sortOrder"],
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        status,
        setStatus,
        sortBy,
        sortOrder,
        onSort,
        setPage,
        setPageSize,
        queryParams,
    };
}
