import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "./category.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { QueryRawMatCategoryDTO, RequestRawMatCategoryDTO } from "./category.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusEnumDTO } from "@/shared/types";

export function useCategory(params?: QueryRawMatCategoryDTO, id?: number) {
    const categories = useQuery({
        queryKey: ["category", params],
        queryFn: () => CategoryService.list(params!),
        enabled: !!params && !id,
    });

    const category = useQuery({
        queryKey: ["category", id],
        queryFn: () => CategoryService.detail(Number(id)),
        enabled: !params && !!id,
    });

    return { categories, category };
}

export function useFormCategory(id?: number) {
    const setNotif = useSetAtom(notificationAtom);
    const setErr = useSetAtom(errorAtom);
    const queryClient = useQueryClient();
    const create = useMutation<unknown, ResponseError, RequestRawMatCategoryDTO>({
        mutationKey: ["category", "create"],
        mutationFn: (body) => CategoryService.create(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            setNotif({
                title: "Tambah Kategori Raw Material",
                message: "Kategori raw material baru berhasil ditambahkan",
            });
        },
    });

    const update = useMutation<unknown, ResponseError, Partial<RequestRawMatCategoryDTO>>({
        mutationKey: ["category", "update"],
        mutationFn: (body) => CategoryService.update(Number(id), body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            setNotif({
                title: "Update Kategori Raw Material",
                message: "Kategori raw material berhasil diupdate",
            });
        },
    });

    const deleted = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["category", "deleted"],
        mutationFn: ({ id }) => CategoryService.delete(id),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            setNotif({
                title: "Hapus Kategori Raw Material",
                message: "Kategori raw material berhasil dihapus",
            });
        },
    });

    return { create, update, deleted };
}

export function useCategoryTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    const status = (get("status") as StatusEnumDTO) ?? "ACTIVE";
    const isDeleted = status === "DELETE";

    const toggleTrashMode = () =>
        batchSet({
            status: isDeleted ? "ACTIVE" : "DELETE",
            page: "1",
        });

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    const queryParams = useMemo<QueryRawMatCategoryDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryRawMatCategoryDTO["sortBy"],
            sortOrder,
            status,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        status,
        isDeleted,
        toggleTrashMode,
        queryParams,
        setPage,
        setPageSize,
    };
}

export function useCategoriesQuery(params: QueryRawMatCategoryDTO) {
    const query = useCategory(params);
    return {
        data: query.categories.data?.data ?? [],
        meta: query.categories,
    };
}
