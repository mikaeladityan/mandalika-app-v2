import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UnitService } from "./unit.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { QueryUnitDTO, RequestUnitDTO, UpdateUnitDTO } from "./unit.schema";

// ─── Query Hook ──────────────────────────────────────────────────────────────
export function useUnit(query?: QueryUnitDTO) {
    const list = useQuery({
        queryKey: ["units", query],
        queryFn: () => UnitService.list(query),
    });

    return {
        units: list,
        data: list.data?.data ?? [],
        len: list.data?.len ?? 0,
        isLoading: list.isLoading,
        isError: list.isError,
        isFetching: list.isFetching,
        isRefetching: list.isRefetching,
        refetch: list.refetch,
    };
}

// ─── Mutation Hook ───────────────────────────────────────────────────────────
export function useActionUnit() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["units"], type: "all" });

    const create = useMutation<unknown, ResponseError, RequestUnitDTO>({
        mutationKey: ["unit", "create"],
        mutationFn: (body) => UnitService.create(body),
        onSuccess: () => {
            setNotif({ title: "Tambah Satuan", message: "Berhasil menambahkan satuan baru" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, { id: number; body: UpdateUnitDTO }>({
        mutationKey: ["unit", "update"],
        mutationFn: ({ id, body }) => UnitService.update(id, body),
        onSuccess: () => {
            setNotif({ title: "Update Satuan", message: "Berhasil memperbarui satuan" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const remove = useMutation<unknown, ResponseError, number>({
        mutationKey: ["unit", "delete"],
        mutationFn: (id) => UnitService.delete(id),
        onSuccess: () => {
            setNotif({ title: "Hapus Satuan", message: "Berhasil menghapus satuan" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update, remove };
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce, useQueryParams } from "@/shared/hooks";

// ─── Table State Hook ────────────────────────────────────────────────────────
export function useUnitTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    const sortBy = get("sortBy") ?? "id";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    const queryParams = useMemo<QueryUnitDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ?? undefined,
        }),
        [searchParams],
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
    };
}

// ─── Query Wrapper ───────────────────────────────────────────────────────────
export function useUnitsQuery(params: QueryUnitDTO) {
    const query = useUnit(params);
    return {
        data: query.data,
        meta: query.units,
    };
}
