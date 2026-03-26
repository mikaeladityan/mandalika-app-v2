import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryRawMaterialDTO, RequestRawMaterialDTO } from "./rawmat.schema";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RawMatService } from "./rawmat.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";

export function useRawMaterial(params?: QueryRawMaterialDTO, id?: number) {
    const list = useQuery({
        queryKey: ["rawmat", params],
        queryFn: () => RawMatService.list(params as QueryRawMaterialDTO),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["rawmat", id],
        queryFn: () => RawMatService.detail(Number(id)),
        enabled: !!id && !params,
    });

    return {
        rawMaterials: list.data,
        rawMaterial: detail.data,
        isLoading: detail.isLoading,
        isError: list.isError || detail.isError,
        isFetching: list.isFetching || detail.isFetching,
        isRefetching: list.isRefetching || detail.isRefetching,
        refetch: list.refetch || detail.refetch,
    };
}

export function useRawMaterialUtils(isDashboard?: boolean) {
    const utils = useQuery({
        queryKey: ["rawmat", "utils"],
        queryFn: () => RawMatService.getUtils(),
        enabled: !isDashboard,
    });

    const countUtils = useQuery({
        queryKey: ["rawmat", "utils", "count"],
        queryFn: () => RawMatService.countUtils(),
        enabled: !!isDashboard,
    });

    return {
        utils,
        countUtils,
    };
}

export function useFormRawMat(id?: number) {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestRawMaterialDTO>({
        mutationKey: ["rawmat", "create"],
        mutationFn: (body) => RawMatService.create(body),
        onSuccess: () => {
            setNotif({
                title: "Tambah Raw Material baru",
                message: "Berhasil menambahkan raw material baru",
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, Partial<RequestRawMaterialDTO>>({
        mutationKey: ["rawmat", "update", id],
        mutationFn: (body) => RawMatService.update(Number(id), body),
        onSuccess: () => {
            setNotif({
                title: "Update Raw Material",
                message: "Raw material berhasil diupdate",
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const patch = useMutation<
        unknown,
        ResponseError,
        { id: number; body: Partial<RequestRawMaterialDTO> }
    >({
        mutationKey: ["rawmat", "patch"],
        mutationFn: ({ id, body }) => RawMatService.partialUpdate(id, body),
        onSuccess: () => {
            setNotif({
                title: "Update Data",
                message: "Data berhasil diperbarui",
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update, patch };
}

export function useActionRawMat() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const deleted = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["rawmat", "deleted"],
        mutationFn: ({ id }) => RawMatService.delete(id),
        onSuccess: () => {
            setNotif({
                title: "Hapus Raw Material",
                message: "Berhasil menghapus raw material",
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const restore = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["rawmat", "restore"],
        mutationFn: ({ id }) => RawMatService.restore(id),
        onSuccess: () => {
            setNotif({
                title: "Restore Raw Material",
                message: "Raw material berhasil dipulihkan",
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const clean = useMutation<unknown, ResponseError, void>({
        mutationKey: ["rawmat", "clean"],
        mutationFn: RawMatService.clean,
        onSuccess: () => {
            setNotif({
                title: "Clean Raw Material",
                message: "Sampah raw material berhasil dibersihkan",
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const bulkStatus = useMutation<unknown, ResponseError, { ids: number[]; status: "ACTIVE" | "DELETE" }>({
        mutationKey: ["rawmat", "bulkStatus"],
        mutationFn: ({ ids, status }) => RawMatService.bulkStatus(ids, status),
        onSuccess: (_, variables) => {
            setNotif({
                title: "Update Status Massal",
                message: `Berhasil ${variables.status === "ACTIVE" ? "memulihkan" : "menghapus"} ${variables.ids.length} raw material`,
            });
            queryClient.invalidateQueries({ queryKey: ["rawmat"], type: "all" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const exportCsv = useMutation<Blob, ResponseError, QueryRawMaterialDTO>({
        mutationKey: ["rawmat", "export"],
        mutationFn: (params) => RawMatService.export(params),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `raw-materials-${new Date().toISOString().split("T")[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            setNotif({
                title: "Export Berhasil",
                message: "Data raw material berhasil didownload",
            });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { deleted, restore, clean, bulkStatus, exportCsv };
}

export function useRawMaterialTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    /* ================= SEARCH ================= */
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    /* ================= SORT ================= */
    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    /* ================= STATUS ================= */
    const status = (get("status") as "actived" | "deleted") ?? "actived";
    const isDeleted = status === "deleted";
    const toggleTrashMode = () =>
        batchSet({
            status: isDeleted ? "actived" : "deleted",
            page: "1",
        });

    /* ================= FILTERS (category / supplier / unit) ================= */
    const rawCategoryId = get("category_id");
    const categoryId = rawCategoryId ? Number(rawCategoryId) : undefined;
    const setCategoryId = (id?: number) =>
        batchSet({ category_id: id ? String(id) : undefined, page: "1" });

    const rawSupplierId = get("supplier_id");
    const supplierId = rawSupplierId ? Number(rawSupplierId) : undefined;
    const setSupplierId = (id?: number) =>
        batchSet({ supplier_id: id ? String(id) : undefined, page: "1" });

    const rawUnitId = get("unit_id");
    const unitId = rawUnitId ? Number(rawUnitId) : undefined;
    const setUnitId = (id?: number) =>
        batchSet({ unit_id: id ? String(id) : undefined, page: "1" });

    const resetFilters = () => {
        setSearch("");
        batchSet({
            search: undefined,
            category_id: undefined,
            supplier_id: undefined,
            unit_id: undefined,
            page: "1",
        });
    };

    /* ================= PAGINATION ================= */
    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    /* ================= QUERY PARAMS ================= */
    const queryParams = useMemo<QueryRawMaterialDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryRawMaterialDTO["sortBy"],
            sortOrder,
            status,
            category_id: categoryId,
            supplier_id: supplierId,
            unit_id: unitId,
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

        categoryId,
        setCategoryId,
        supplierId,
        setSupplierId,
        unitId,
        setUnitId,
        resetFilters,

        queryParams,
        setPage,
        setPageSize,
    };
}

export function useRawMaterialsQuery(params: QueryRawMaterialDTO) {
    const query = useRawMaterial(params);

    return {
        data: query.rawMaterials?.data ?? [],
        meta: query.rawMaterials,
        ...query,
    };
}
