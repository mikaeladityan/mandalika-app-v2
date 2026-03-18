import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryOutletDTO, RequestOutletDTO, UpdateOutletDTO } from "./outlet.schema";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OutletService } from "./outlet.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";

export function useOutlets(params: QueryOutletDTO) {
    const list = useQuery({
        queryKey: ["outlets", params],
        queryFn: () => OutletService.list(params),
        enabled: !!params,
    });

    return {
        outlets: list.data,
        isLoading: list.isLoading,
        isError: list.isError,
        isFetching: list.isFetching,
        refetch: list.refetch,
    };
}

export function useOutlet(id: number) {
    return useQuery({
        queryKey: ["outlets", id],
        queryFn: () => OutletService.detail(id),
        enabled: !!id,
    });
}

export function useFormOutlet(id?: number) {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestOutletDTO>({
        mutationKey: ["outlets", "create"],
        mutationFn: (body) => OutletService.create(body),
        onSuccess: () => {
            setNotif({
                title: "Tambah Outlet",
                message: "Outlet baru berhasil ditambahkan",
            });
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, UpdateOutletDTO>({
        mutationKey: ["outlets", "update", id],
        mutationFn: (body) => OutletService.update(Number(id), body),
        onSuccess: () => {
            setNotif({
                title: "Update Outlet",
                message: "Data outlet berhasil diperbarui",
            });
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update };
}

export function useActionOutlet() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const toggleStatus = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["outlets", "toggleStatus"],
        mutationFn: ({ id }) => OutletService.toggleStatus(id),
        onSuccess: (data: any) => {
            setNotif({
                title: "Status Outlet",
                message: `Outlet ${data.name} sekarang ${data.is_active ? "Aktif" : "Non-Aktif"}`,
            });
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const deleteOutlet = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["outlets", "delete"],
        mutationFn: ({ id }) => OutletService.delete(id),
        onSuccess: () => {
            setNotif({
                title: "Hapus Outlet",
                message: "Outlet berhasil dipindahkan ke sampah",
            });
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const clean = useMutation<unknown, ResponseError, void>({
        mutationKey: ["outlets", "clean"],
        mutationFn: OutletService.clean,
        onSuccess: () => {
            setNotif({
                title: "Bersihkan Sampah",
                message: "Berhasil membersihkan outlet yang dihapus permanen",
            });
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { toggleStatus, deleteOutlet, clean };
}

export function useOutletTableState() {
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

    /* ================= STATUS ================= */
    const is_active = get("is_active");
    const set_active = (val?: "true" | "false") => batchSet({ is_active: val, page: "1" });

    /* ================= WAREHOUSE ================= */
    const rawWarehouseId = get("warehouse_id");
    const warehouseId = rawWarehouseId ? Number(rawWarehouseId) : undefined;
    const setWarehouseId = (id?: number) =>
        batchSet({ warehouse_id: id ? String(id) : undefined, page: "1" });

    /* ================= PAGINATION ================= */
    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    /* ================= QUERY PARAMS ================= */
    const queryParams = useMemo<QueryOutletDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ?? undefined,
            is_active: (get("is_active") as any) ?? undefined,
            warehouse_id: warehouseId,
            sortBy: sortBy as QueryOutletDTO["sortBy"],
            sortOrder: sortOrder as QueryOutletDTO["sortOrder"],
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        is_active,
        set_active,
        warehouseId,
        setWarehouseId,
        setPage,
        setPageSize,
        queryParams,
    };
}
