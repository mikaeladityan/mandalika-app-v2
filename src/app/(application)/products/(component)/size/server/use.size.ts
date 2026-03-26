import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SizeService } from "./size.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { QuerySizeDTO, RequestSizeDTO, UpdateSizeDTO } from "./size.schema";

// ─── Query Hook ──────────────────────────────────────────────────────────────
export function useSizes(query?: QuerySizeDTO) {
    const list = useQuery({
        queryKey: ["sizes", query],
        queryFn: () => SizeService.list(query),
    });

    return {
        sizes: list,
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
export function useActionSize() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["sizes"], type: "all" });

    const create = useMutation<unknown, ResponseError, RequestSizeDTO>({
        mutationKey: ["size", "create"],
        mutationFn: (body) => SizeService.create(body),
        onSuccess: () => {
            setNotif({ title: "Tambah Ukuran", message: "Berhasil menambahkan ukuran baru" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, { id: number; body: UpdateSizeDTO }>({
        mutationKey: ["size", "update"],
        mutationFn: ({ id, body }) => SizeService.update(id, body),
        onSuccess: () => {
            setNotif({ title: "Update Ukuran", message: "Berhasil memperbarui ukuran" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const remove = useMutation<unknown, ResponseError, number>({
        mutationKey: ["size", "delete"],
        mutationFn: (id) => SizeService.delete(id),
        onSuccess: () => {
            setNotif({ title: "Hapus Ukuran", message: "Berhasil menghapus ukuran" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update, remove };
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce, useQueryParams } from "@/shared/hooks";

// ─── Table State Hook ────────────────────────────────────────────────────────
export function useSizeTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    const sortBy = get("sortBy") ?? "size";
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

    const queryParams = useMemo<QuerySizeDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ? Number(get("search")) : undefined,
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
export function useSizesQuery(params: QuerySizeDTO) {
    const query = useSizes(params);
    return {
        data: query.data,
        meta: query.sizes,
    };
}
