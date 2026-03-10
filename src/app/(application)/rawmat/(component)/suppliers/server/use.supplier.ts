import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchError, ResponseError } from "@/lib/utils/error";

import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusEnumDTO } from "@/shared/types";
import { QuerySupplierDTO, RequestSupplierDTO } from "./supplier.schema";
import { SupplierService } from "./supplier.service";

export function useSupplier(params?: QuerySupplierDTO, id?: number) {
    const suppliers = useQuery({
        queryKey: ["supplier", params],
        queryFn: () => SupplierService.list(params!),
        enabled: !!params && !id,
    });

    const supplier = useQuery({
        queryKey: ["supplier", id],
        queryFn: () => SupplierService.detail(Number(id)),
        enabled: !params && !!id,
    });

    return { suppliers, supplier };
}

export function useFormSupplier(id?: number) {
    const setNotif = useSetAtom(notificationAtom);
    const setErr = useSetAtom(errorAtom);
    const queryClient = useQueryClient();
    const create = useMutation<unknown, ResponseError, RequestSupplierDTO>({
        mutationKey: ["supplier", "create"],
        mutationFn: (body) => SupplierService.create(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["supplier"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            setNotif({
                title: "Tambah Supplier",
                message: "Supplier baru berhasil ditambahkan",
            });
        },
    });

    const update = useMutation<unknown, ResponseError, Partial<RequestSupplierDTO>>({
        mutationKey: ["supplier", "update"],
        mutationFn: (body) => SupplierService.update(Number(id), body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["supplier"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            setNotif({
                title: "Update Supplier",
                message: "Supplier berhasil diupdate",
            });
        },
    });

    const deleted = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["supplier", "deleted"],
        mutationFn: ({ id }) => SupplierService.delete(id),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["supplier"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            setNotif({
                title: "Hapus Supplier",
                message: "Supplier berhasil dihapus",
            });
        },
    });

    return { create, update, deleted };
}

export function useSupplierTableState() {
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

    const queryParams = useMemo<QuerySupplierDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 50),
            search: get("search") ?? undefined,
            sortBy: sortBy as QuerySupplierDTO["sortBy"],
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

export function useSuppliersQuery(params: QuerySupplierDTO) {
    const query = useSupplier(params);
    return {
        data: query.suppliers.data?.data ?? [],
        meta: query.suppliers,
    };
}
