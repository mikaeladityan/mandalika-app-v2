import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GoodsReceiptService } from "./gr.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { CreateGoodsReceiptDTO, QueryGoodsReceiptDTO } from "./gr.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useGoodsReceipt(params?: QueryGoodsReceiptDTO, id?: number) {
    const list = useQuery({
        queryKey: ["goods-receipts", params],
        queryFn: () => GoodsReceiptService.list(params as QueryGoodsReceiptDTO),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["goods-receipts", id],
        queryFn: () => GoodsReceiptService.detail(Number(id)),
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

export function useFormGoodsReceipt() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, CreateGoodsReceiptDTO>({
        mutationKey: ["goods-receipt", "create"],
        mutationFn: (body) => GoodsReceiptService.create(body),
        onSuccess: () => {
            setNotif({ title: "Goods Receipt", message: "Berhasil membuat Goods Receipt baru" });
            queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const post = useMutation<unknown, ResponseError, number>({
        mutationKey: ["goods-receipt", "post"],
        mutationFn: (id) => GoodsReceiptService.post(id),
        onSuccess: () => {
            setNotif({ title: "Goods Receipt", message: "Berhasil memposting Goods Receipt ke stok" });
            queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-v2-stocks"] }); // Optional, for global stock view
        },
        onError: (err) => FetchError(err, setErr),
    });

    const cancel = useMutation<unknown, ResponseError, number>({
        mutationKey: ["goods-receipt", "cancel"],
        mutationFn: (id) => GoodsReceiptService.cancel(id),
        onSuccess: () => {
            setNotif({ title: "Goods Receipt", message: "Berhasil membatalkan Goods Receipt" });
            queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, post, cancel };
}

export function useExportGoodsReceipt() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const exportMutation = useMutation<void, ResponseError, QueryGoodsReceiptDTO>({
        mutationKey: ["goods-receipt", "export"],
        mutationFn: (params) => GoodsReceiptService.export(params),
        onSuccess: () => {
            setNotif({ title: "Export", message: "Data Goods Receipt berhasil diunduh" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        exportData: exportMutation.mutate,
        isExporting: exportMutation.isPending,
    };
}

export function useExportGRDetail() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const exportMutation = useMutation<void, ResponseError, { id: number; grNumber: string }>({
        mutationKey: ["goods-receipt", "export-detail"],
        mutationFn: ({ id, grNumber }) => GoodsReceiptService.exportDetail(id, grNumber),
        onSuccess: () => {
            setNotif({ title: "Export", message: "Detail Goods Receipt berhasil diunduh" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        exportDetailData: exportMutation.mutate,
        isExportingDetail: exportMutation.isPending,
    };
}

export function useGRTableState() {
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
    const setWarehouse = (id?: number) => batchSet({ warehouse_id: id ? String(id) : undefined, page: "1" });
    const setStatus = (status?: string) => batchSet({ status: status || undefined, page: "1" });

    const queryParams = useMemo<QueryGoodsReceiptDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            warehouse_id: get("warehouse_id") ? Number(get("warehouse_id")) : undefined,
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
        setWarehouse,
        setStatus,
    };
}
