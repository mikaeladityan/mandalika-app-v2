import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeliveryOrderService } from "./do.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { RequestDeliveryOrderDTO, QueryDeliveryOrderDTO, UpdateDeliveryOrderStatusDTO } from "./do.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useEffect, useMemo, useState } from "react";

export function useDeliveryOrder(params?: QueryDeliveryOrderDTO, id?: number) {
    const list = useQuery({
        queryKey: ["delivery-orders", params],
        queryFn: () => DeliveryOrderService.list(params as QueryDeliveryOrderDTO),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["delivery-orders", id],
        queryFn: () => DeliveryOrderService.detail(Number(id)),
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

export function useDOStock(warehouse_id?: number, product_id?: number, outlet_id?: number) {
    return useQuery({
        queryKey: ["delivery-order", "stock", warehouse_id, outlet_id, product_id],
        queryFn: () => DeliveryOrderService.getStock(warehouse_id, product_id, outlet_id),
        enabled: (!!warehouse_id || !!outlet_id) && !!product_id,
    });
}

export function useFormDeliveryOrder() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestDeliveryOrderDTO>({
        mutationKey: ["delivery-order", "create"],
        mutationFn: (body) => DeliveryOrderService.create(body),
        onSuccess: () => {
            setNotif({ title: "Delivery Order", message: "Berhasil membuat Packing List (DO)" });
            queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const updateStatus = useMutation<unknown, ResponseError, { id: number; body: UpdateDeliveryOrderStatusDTO }>({
        mutationKey: ["delivery-order", "update-status"],
        mutationFn: ({ id, body }) => DeliveryOrderService.updateStatus(id, body),
        onSuccess: () => {
            setNotif({ title: "Delivery Order", message: "Berhasil memperbarui status DO" });
            queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-v2-stocks"] }); 
            queryClient.invalidateQueries({ queryKey: ["outlets"] }); 
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, updateStatus };
}

export function useExportDeliveryOrder() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const exportMutation = useMutation<void, ResponseError, QueryDeliveryOrderDTO>({
        mutationKey: ["delivery-orders", "export"],
        mutationFn: (params) => DeliveryOrderService.export(params),
        onSuccess: () => {
            setNotif({ title: "Export", message: "Data Delivery Order berhasil diunduh" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        exportData: exportMutation.mutate,
        isExporting: exportMutation.isPending,
    };
}

export function useExportDODetail() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const exportMutation = useMutation<void, ResponseError, { id: number; transferNumber: string }>({
        mutationKey: ["delivery-orders", "export-detail"],
        mutationFn: ({ id, transferNumber }) => DeliveryOrderService.exportDetail(id, transferNumber),
        onSuccess: () => {
            setNotif({ title: "Export", message: "Detail Delivery Order berhasil diunduh" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        exportDetailData: exportMutation.mutate,
        isExportingDetail: exportMutation.isPending,
    };
}

export function useDOTableState() {
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
    const setTargetOutlet = (id?: number) => batchSet({ to_outlet_id: id ? String(id) : undefined, page: "1" });
    const setStatus = (status?: string) => batchSet({ status: status || undefined, page: "1" });

    const [targetType, setTargetType] = useState<string | null>(null);

    const queryParams = useMemo<QueryDeliveryOrderDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            from_warehouse_id: get("from_warehouse_id") ? Number(get("from_warehouse_id")) : undefined,
            to_outlet_id: get("to_outlet_id") ? Number(get("to_outlet_id")) : undefined,
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
        setTargetOutlet,
        setStatus,
        targetType,
        setTargetType
    };
}
