import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransferGudangService } from "./tg.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { RequestTransferGudangDTO, QueryTransferGudangDTO, UpdateTransferGudangStatusDTO } from "./tg.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useEffect, useMemo, useState } from "react";

export function useTransferGudang(params?: QueryTransferGudangDTO, id?: number) {
    const list = useQuery({
        queryKey: ["transfer-gudang", params],
        queryFn: () => TransferGudangService.list(params as QueryTransferGudangDTO),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["transfer-gudang", id],
        queryFn: () => TransferGudangService.detail(Number(id)),
        enabled: !!id && !params,
    });

    return {
        data: list.data?.data ?? [],
        meta: list.data,
        detail: detail.data,
        isLoading: list.isLoading || detail.isLoading,
        isFetching: list.isFetching || detail.isFetching,
        isError: list.isError || detail.isError,
        refetch: list.refetch || detail.refetch,
    };
}

export function useTGStock(warehouse_id?: number, product_id?: number) {
    return useQuery({
        queryKey: ["transfer-gudang", "stock", warehouse_id, product_id],
        queryFn: () => TransferGudangService.getStock(warehouse_id, product_id),
        enabled: !!warehouse_id && !!product_id,
    });
}

export function useFormTransferGudang() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestTransferGudangDTO>({
        mutationKey: ["transfer-gudang", "create"],
        mutationFn: (body) => TransferGudangService.create(body),
        onSuccess: () => {
            setNotif({ title: "Transfer Gudang", message: "Berhasil membuat Packing List (TG)" });
            queryClient.invalidateQueries({ queryKey: ["transfer-gudang"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const updateStatus = useMutation<unknown, ResponseError, { id: number; body: UpdateTransferGudangStatusDTO }>({
        mutationKey: ["transfer-gudang", "update-status"],
        mutationFn: ({ id, body }) => TransferGudangService.updateStatus(id, body),
        onSuccess: () => {
            setNotif({ title: "Transfer Gudang", message: "Berhasil memperbarui status TG" });
            queryClient.invalidateQueries({ queryKey: ["transfer-gudang"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-v2-stocks"] }); 
            queryClient.invalidateQueries({ queryKey: ["warehouses"] }); 
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, updateStatus };
}

export function useExportTransferGudang() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const exportMutation = useMutation<void, ResponseError, QueryTransferGudangDTO>({
        mutationKey: ["transfer-gudang", "export"],
        mutationFn: (params) => TransferGudangService.export(params),
        onSuccess: () => {
            setNotif({ title: "Export", message: "Data Transfer Gudang berhasil diunduh" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        exportData: exportMutation.mutate,
        isExporting: exportMutation.isPending,
    };
}

export function useTGTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });
    const setSourceWarehouse = (id?: number) => batchSet({ from_warehouse_id: id ? String(id) : undefined, page: "1" });
    const setTargetWarehouse = (id?: number) => batchSet({ to_warehouse_id: id ? String(id) : undefined, page: "1" });
    const setStatus = (status?: string) => batchSet({ status: status || undefined, page: "1" });

    const queryParams = useMemo<QueryTransferGudangDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            from_warehouse_id: get("from_warehouse_id") ? Number(get("from_warehouse_id")) : undefined,
            to_warehouse_id: get("to_warehouse_id") ? Number(get("to_warehouse_id")) : undefined,
            status: (get("status") as any) ?? undefined,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        queryParams,
        setPage,
        setPageSize,
        setSourceWarehouse,
        setTargetWarehouse,
        setStatus,
    };
}
