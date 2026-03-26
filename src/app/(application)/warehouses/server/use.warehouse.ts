import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WarehouseService } from "./warehouse.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useRouter } from "next/navigation";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { QueryWarehouseDTO, RequestWarehouseDTO } from "./warehouse.schema";
import { StatusEnumDTO } from "@/shared/types";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useFormWarehouse(id?: number) {
    const setNotif = useSetAtom(notificationAtom);
    const setErr = useSetAtom(errorAtom);
    const queryClient = useQueryClient();
    const routes = useRouter();

    const create = useMutation<{ name: string }, ResponseError, RequestWarehouseDTO>({
        mutationKey: ["warehouse", "create"],
        mutationFn: (body) => WarehouseService.create(body),
        onError: (err) => FetchError(err, setErr),
        onSuccess: (data) => {
            setNotif({
                title: `Gudang ${data.name}`,
                message: `Berhasil menambahkan data gudang ${data.name} baru`,
            });
            queryClient.invalidateQueries({ queryKey: ["warehouse"], type: "all" });
            routes.replace("/warehouses");
        },
    });

    const update = useMutation<{ name: string }, ResponseError, Partial<RequestWarehouseDTO>>({
        mutationKey: ["warehouse", "update"],
        mutationFn: (body) => WarehouseService.update(Number(id), body),
        onError: (err) => FetchError(err, setErr),
        onSuccess: (data) => {
            setNotif({
                title: `Pengaturan Gudang ${data.name}`,
                message: `Berhasil melakukan perubahaan data gudang ${data.name} baru`,
            });
            queryClient.invalidateQueries({ queryKey: ["warehouse"], type: "all" });
            routes.replace("/warehouses");
        },
    });

    const changeStatus = useMutation<{ name: string }, ResponseError, { status: StatusEnumDTO }>({
        mutationKey: ["warehouse", "changeStatus"],
        mutationFn: ({ status }) => WarehouseService.changeStatus(Number(id), status),
        onError: (err) => FetchError(err, setErr),
        onSuccess: (data) => {
            setNotif({
                title: `Status Gudang ${data.name}`,
                message: `Berhasil mengubah status data gudang ${data.name}`,
            });
            queryClient.invalidateQueries({ queryKey: ["warehouse"], type: "all" });
            routes.replace("/warehouses");
        },
    });

    const deleted = useMutation<unknown, ResponseError>({
        mutationKey: ["warehouse", "delete", id],
        mutationFn: () => WarehouseService.deleted(Number(id)),
        onError: (err) => FetchError(err, setErr),
        onSuccess: () => {
            setNotif({
                title: `Hapus Gudang`,
                message: `Berhasil menghapus data gudang`,
            });
            queryClient.invalidateQueries({ queryKey: ["warehouse"], type: "all" });
            routes.replace("/warehouses");
        },
    });

    return { create, update, changeStatus, deleted };
}

export function useWarehouse(params?: QueryWarehouseDTO, id?: number) {
    const list = useQuery({
        queryKey: ["warehouse", params],
        queryFn: () => WarehouseService.list(params!),
        enabled: !!params && !id,
    });
    const detail = useQuery({
        queryKey: ["warehouse", id],
        queryFn: () => WarehouseService.detail(Number(id)),
        enabled: !!id && !params,
    });

    return {
        list: list.data?.data ?? [],
        total: list.data?.len ?? 0,
        detail: detail.data,
        isLoading: list.isLoading || detail.isLoading,
        isRefetching: list.isRefetching || detail.isRefetching,
        isError: list.isError || detail.isError,
        refetch: list.refetch || detail.refetch,
    };
}

export function useWarehouseTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // 1. Search Logic
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    // 2. Sort Logic
    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "asc";
    const newType = (get("type") as QueryWarehouseDTO["type"]) ?? undefined;

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: nextOrder });
        },
        [sortBy, sortOrder, batchSet],
    );

    // 3. Pagination & Take Logic
    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (size: number) => batchSet({ take: String(size), page: "1" });

    const setType = (type?: QueryWarehouseDTO["type"]) => {
        batchSet({ type: type || undefined, page: "1" });
    };

    const queryParams = useMemo<QueryWarehouseDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as any,
            sortOrder: sortOrder as any,
            type: newType,
            month: get("month") ? Number(get("month")) : undefined,
            year: get("year") ? Number(get("year")) : undefined,
        }),
        [searchParams, get, sortBy, sortOrder],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        queryParams,
        setPage,
        setPageSize,
        setType,
    };
}

export function useWarehouseQuery(params: QueryWarehouseDTO) {
    const query = useQuery({
        queryKey: ["warehouse", params],
        queryFn: () => WarehouseService.list(params),
    });

    return {
        list: query.data?.data ?? [],
        total: query.data?.len ?? 0,
        ...query,
    };
}

export function useWarehouseStatic(params: QueryWarehouseDTO) {
    const query = useQuery({
        queryKey: ["warehouse", "static-list", params.type],
        queryFn: () => WarehouseService.list(params),
        staleTime: Infinity,
    });

    return {
        ...query,
        data: query.data?.data ?? [],
        total: query.data?.len ?? 0,
    };
}
