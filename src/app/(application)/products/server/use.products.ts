import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "./products.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { QueryProductDTO, RequestProductDTO } from "./products.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenderEnumDTO, STATUS } from "@/shared/types";
export function useProduct(params?: QueryProductDTO, id?: number) {
    const list = useQuery({
        queryKey: ["products", params],
        queryFn: () => ProductService.list(params as QueryProductDTO),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["products", id],
        queryFn: () => ProductService.detail(Number(id)),
        enabled: !!id && !params,
    });

    return {
        products: list.data,
        product: detail.data,
        isLoading: detail.isLoading,
        isError: list.isError || detail.isError,
        isFetching: list.isFetching || detail.isFetching,
        isRefetching: list.isRefetching || detail.isRefetching,
        refetch: list.refetch || detail.refetch,
    };
}

export function useFormProduct() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestProductDTO>({
        mutationKey: ["product", "create"],
        mutationFn: (body) => ProductService.create(body),
        onSuccess: () => {
            setNotif({ title: "Tambah Produk Baru", message: "Berhasil menambahkan produk baru" });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["types"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["units"], type: "all" });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    const update = useMutation<
        unknown,
        ResponseError,
        { body: Partial<RequestProductDTO>; id: number }
    >({
        mutationKey: ["product", "update"],
        mutationFn: ({ body, id }) => ProductService.update(body, id),
        onSuccess: () => {
            setNotif({ title: "Update Produk", message: "Berhasil melakukan update produk" });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["types"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["units"], type: "all" });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    return {
        create,
        update,
    };
}

export function useActionProduct() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const changeStatus = useMutation<
        unknown,
        ResponseError,
        { id: number; status: (typeof STATUS)[number] }
    >({
        mutationKey: ["product", "changeStatus"],
        mutationFn: ({ id, status }) => ProductService.changeStatus(id, status),
        onSuccess: () => {
            setNotif({
                title: "Update Status Produk",
                message: "Berhasil mengubah status produk",
            });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    const clean = useMutation<unknown, ResponseError, void>({
        mutationKey: ["product", "clean"],
        mutationFn: () => ProductService.clean(),
        onSuccess: () => {
            setNotif({
                title: "Clean Sampah Produk",
                message: "Berhasil menghapus permanen produk yang telah dihapus",
            });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    const bulkStatus = useMutation<
        unknown,
        ResponseError,
        { ids: number[]; status: (typeof STATUS)[number] }
    >({
        mutationKey: ["product", "bulkStatus"],
        mutationFn: ({ ids, status }) => ProductService.bulkStatus(ids, status),
        onSuccess: () => {
            setNotif({
                title: "Update Status Produk",
                message: "Berhasil mengubah status produk terpilih",
            });
            queryClient.invalidateQueries({ queryKey: ["products"], type: "all" });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    const exportCsv = useMutation<unknown, ResponseError, QueryProductDTO>({
        mutationKey: ["product", "export"],
        mutationFn: (params) => ProductService.export(params),
        onSuccess: () => {
            setNotif({
                title: "Export Berhasil",
                message: "Aksi export data selesai",
            });
        },
        onError: (err) => {
            FetchError(err, setErr);
        },
    });

    return { changeStatus, bulkStatus, exportCsv, clean };
}

export function useProductTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // Search
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    // Sort
    const sortBy = get("sortBy") ?? "updated_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";

            batchSet({
                sortBy: key,
                sortOrder: nextOrder,
                page: "1",
            });
        },
        [sortBy, sortOrder],
    );

    // Trash
    const status = get("status") as QueryProductDTO["status"];
    const isTrashMode = status === "DELETE";

    const toggleTrashMode = () => {
        batchSet({
            status: isTrashMode ? undefined : "DELETE",
            page: "1",
        });
    };

    const gender = get("gender") as QueryProductDTO["gender"];
    const setGender = (value?: GenderEnumDTO) =>
        batchSet({
            gender: value ? String(value) : undefined,
            page: "1",
        });

    const type_id = get("type_id") ? Number(get("type_id")) : undefined;

    const setType = (value?: number) =>
        batchSet({
            type_id: value ? String(value) : undefined,
            page: "1",
        });

    const size_id = get("size_id") ? Number(get("size_id")) : undefined;

    const setSize = (value?: number) =>
        batchSet({
            size_id: value ? String(value) : undefined,
            page: "1",
        });

    const resetFilters = () => {
        setSearch("");
        batchSet({
            search: undefined,
            gender: undefined,
            type_id: undefined,
            size_id: undefined,
            page: "1",
        });
    };

    // Set Page
    const setPage = (page: number) => batchSet({ page: String(page) });

    const setPageSize = (take: number) =>
        batchSet({
            take: String(take),
            page: "1",
        });

    // Query DTO
    const queryParams = useMemo<QueryProductDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryProductDTO["sortBy"],
            sortOrder,
            status,
            gender,
            type_id,
            size_id,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        sortBy,
        sortOrder,
        onSort,
        isTrashMode,
        toggleTrashMode,
        gender,
        setGender,
        type_id,
        setType,
        size_id,
        setSize,
        resetFilters,
        queryParams,
        setPage,
        setPageSize,
    };
}

export function useProductsQuery(params: QueryProductDTO) {
    const query = useProduct(params);

    return {
        data: query.products?.data ?? [],
        meta: query.products,
        ...query,
    };
}
