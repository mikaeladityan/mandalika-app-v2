import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TypeService } from "./types.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { QueryTypeDTO, RequestTypeDTO, UpdateTypeDTO } from "./type.schema";

// ─── Query Hook ──────────────────────────────────────────────────────────────
export function useType(query?: QueryTypeDTO) {
    const list = useQuery({
        queryKey: ["types", query],
        queryFn: () => TypeService.list(query),
    });

    return {
        types: list,
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
export function useActionType() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["types"], type: "all" });

    const create = useMutation<unknown, ResponseError, RequestTypeDTO>({
        mutationKey: ["type", "create"],
        mutationFn: (body) => TypeService.create(body),
        onSuccess: () => {
            setNotif({ title: "Tambah Tipe", message: "Berhasil menambahkan tipe produk baru" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, { id: number; body: UpdateTypeDTO }>({
        mutationKey: ["type", "update"],
        mutationFn: ({ id, body }) => TypeService.update(id, body),
        onSuccess: () => {
            setNotif({ title: "Update Tipe", message: "Berhasil memperbarui tipe produk" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const remove = useMutation<unknown, ResponseError, number>({
        mutationKey: ["type", "delete"],
        mutationFn: (id) => TypeService.delete(id),
        onSuccess: () => {
            setNotif({ title: "Hapus Tipe", message: "Berhasil menghapus tipe produk" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update, remove };
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce, useQueryParams } from "@/shared/hooks";

// ─── Table State Hook ────────────────────────────────────────────────────────
export function useTypeTableState() {
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

    const queryParams = useMemo<QueryTypeDTO>(
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
export function useTypesQuery(params: QueryTypeDTO) {
    const query = useType(params);
    return {
        data: query.data,
        meta: query.types,
    };
}
