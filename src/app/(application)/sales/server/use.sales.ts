import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuerySalesDTO, RequestSalesDTO, QuerySalesRekapDTO } from "./sales.schema";
import { QueryDetailSale, SalesService } from "./sales.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useRouter } from "next/navigation";
import { SalesTypeEnumDTO } from "@/shared/types";

export function useFormSales(form?: any) {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const router = useRouter();

    const create = useMutation<unknown, ResponseError, RequestSalesDTO>({
        mutationKey: ["sales", "create"],
        mutationFn: (body) => SalesService.create(body),
        onSuccess: () => {
            setNotif({
                title: "Tambah Penjualan",
                message: "Berhasil menambahkan data penjualan produk baru",
            });
            // Revalidate related modules
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["forecast"] });

            if (form) form.reset();
            router.push("/sales");
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, RequestSalesDTO>({
        mutationKey: ["sales", "update"],
        mutationFn: (body) => SalesService.update(body),
        onSuccess: () => {
            setNotif({
                title: "Perbarui Penjualan",
                message: "Berhasil memperbarui data penjualan produk",
            });
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["forecast"] });

            router.push("/sales");
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update };
}

export const useSales = (params?: QuerySalesDTO, queryDetail?: QueryDetailSale) => {
    const list = useQuery({
        queryKey: ["sales", "list", params],
        queryFn: () => SalesService.list(params!),
        enabled: !!params && !queryDetail,
    });

    const detail = useQuery({
        queryKey: ["sales", "detail", queryDetail],
        queryFn: () => SalesService.detail(queryDetail!),
        enabled: !!queryDetail && !params,
    });

    const productsOption = useQuery({
        queryKey: ["products", "options", "redis"],
        queryFn: SalesService.getProductOptions,
        enabled: false, // Default false, enable manually when needed
    });

    return {
        sales: list.data,
        sale: detail.data,
        products: productsOption.data,
        isLoading: list.isLoading || detail.isLoading,
        isFetching: list.isFetching || detail.isFetching,
        isRefetching: list.isRefetching || detail.isRefetching,
        isError: list.isError || detail.isError,
        refetch: list.refetch || detail.refetch,
        productsOption,
    };
};

export function useSaleTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // 1. Source of Truth: URL for immediate filters
    const gender = get("gender") as any;
    const size = get("size") ? Number(get("size")) : undefined;
    const variant = get("variant") || undefined;
    const horizon = get("horizon") ? Number(get("horizon")) : undefined;
    const product_id = get("product_id") ? Number(get("product_id")) : undefined;
    const product_id_2 = get("product_id_2") ? Number(get("product_id_2")) : undefined;
    const type = get("type") || undefined;

    // 2. Search Logic (with debouncing)
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    // Sync debounced search to URL
    useEffect(() => {
        if (debouncedSearch !== (get("search") ?? "")) {
            batchSet({ search: debouncedSearch || undefined, page: "1" });
        }
    }, [debouncedSearch, get, batchSet]);

    // 3. Setters (updating URL via batchSet)
    const setGender = useCallback((val: any) => batchSet({ gender: val, page: "1" }), [batchSet]);
    const setSize = useCallback(
        (val: any) => batchSet({ size: val ? String(val) : undefined, page: "1" }),
        [batchSet],
    );
    const setVariant = useCallback((val: any) => batchSet({ variant: val, page: "1" }), [batchSet]);
    const setHorizon = useCallback(
        (val: any) => batchSet({ horizon: val ? String(val) : undefined, page: "1" }),
        [batchSet],
    );
    const setProductId = useCallback(
        (val: any) => batchSet({ product_id: val ? String(val) : undefined, page: "1" }),
        [batchSet],
    );
    const setProductId2 = useCallback(
        (val: any) => batchSet({ product_id_2: val ? String(val) : undefined, page: "1" }),
        [batchSet],
    );
    const setType = useCallback(
        (val: any) => batchSet({ type: val === "ALL" ? undefined : val, page: "1" }),
        [batchSet],
    );

    // Sorting & Pagination
    const sortBy = get("sortBy") ?? "quantity";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: nextOrder, page: "1" });
        },
        [sortBy, sortOrder, batchSet],
    );

    const setPage = useCallback((page: number) => batchSet({ page: String(page) }), [batchSet]);
    const setPageSize = useCallback(
        (take: number) => batchSet({ take: String(take), page: "1" }),
        [batchSet],
    );

    const queryParams = useMemo<QuerySalesDTO>(
        () => ({
            take: Number(get("take") ?? 50),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as any,
            sortOrder,
            gender: gender as any,
            size,
            variant,
            horizon,
            product_id,
            product_id_2,
            type: type as SalesTypeEnumDTO,
        }),
        [
            searchParams,
            get,
            sortBy,
            sortOrder,
            gender,
            size,
            variant,
            horizon,
            product_id,
            product_id_2,
            type,
        ],
    );

    const resetFilters = useCallback(() => {
        setSearch("");
        batchSet({
            search: undefined,
            gender: undefined,
            size: undefined,
            variant: undefined,
            horizon: undefined,
            product_id: undefined,
            product_id_2: undefined,
            type: undefined,
            page: "1",
        });
    }, [batchSet]);

    return {
        search,
        setSearch,
        gender,
        setGender,
        size,
        setSize,
        variant,
        setVariant,
        horizon,
        setHorizon,
        product_id,
        setProductId,
        product_id_2,
        setProductId2,
        type,
        setType,
        sortBy,
        sortOrder,
        onSort,
        queryParams,
        setPage,
        setPageSize,
        resetFilters,
    };
}

export function useSaleRekapTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // Recap specific filters: Month & Year (No horizon)
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const month = get("month") ? Number(get("month")) : prevMonthDate.getMonth() + 1;
    const year = get("year") ? Number(get("year")) : prevMonthDate.getFullYear();
    const gender = get("gender") as any;
    const size = get("size") ? Number(get("size")) : undefined;
    const variant = get("variant") || undefined;

    // Search Logic
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (get("search") ?? "")) {
            batchSet({ search: debouncedSearch || undefined, page: "1" });
        }
    }, [debouncedSearch, get, batchSet]);

    // Setters
    const setMonth = useCallback((val: number) => batchSet({ month: String(val), page: "1" }), [batchSet]);
    const setYear = useCallback((val: number) => batchSet({ year: String(val), page: "1" }), [batchSet]);
    const setGender = useCallback((val: any) => batchSet({ gender: val, page: "1" }), [batchSet]);
    const setSize = useCallback((val: any) => batchSet({ size: val ? String(val) : undefined, page: "1" }), [batchSet]);
    const setVariant = useCallback((val: any) => batchSet({ variant: val, page: "1" }), [batchSet]);

    // Sorting & Pagination
    const sortBy = get("sortBy") ?? "total_qty";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: nextOrder, page: "1" });
        },
        [sortBy, sortOrder, batchSet],
    );

    const setPage = useCallback((page: number) => batchSet({ page: String(page) }), [batchSet]);
    const setPageSize = useCallback((take: number) => batchSet({ take: String(take), page: "1" }), [batchSet]);

    const queryParams = useMemo<QuerySalesRekapDTO>(
        () => ({
            take: Number(get("take") ?? 50),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            month,
            year,
            sortBy: sortBy as any,
            sortOrder,
            gender: gender as any,
            size,
            variant,
        }),
        [searchParams, get, sortBy, sortOrder, gender, size, variant, month, year],
    );

    const resetFilters = useCallback(() => {
        setSearch("");
        batchSet({
            search: undefined,
            gender: undefined,
            size: undefined,
            variant: undefined,
            month: String(now.getMonth() + 1),
            year: String(now.getFullYear()),
            page: "1",
        });
    }, [batchSet, now]);

    return {
        search,
        setSearch,
        month,
        setMonth,
        year,
        setYear,
        gender,
        setGender,
        size,
        setSize,
        variant,
        setVariant,
        sortBy,
        sortOrder,
        onSort,
        queryParams,
        setPage,
        setPageSize,
        resetFilters,
    };
}

export function useSaleRekapQuery(params: QuerySalesRekapDTO) {
    const { data: rawData, ...rest } = useQuery({
        queryKey: ["sales", "rekap", params],
        queryFn: () => SalesService.rekap(params),
        enabled: !!params,
    });

    return {
        data: rawData?.rekap ?? [],
        total: rawData?.len ?? 0,
        ...rest,
    };
}

export function useSaleQuery(params: QuerySalesDTO) {
    const query = useSales(params);

    return {
        data: query.sales?.sales ?? [],
        total: query.sales?.len ?? 0,
        ...query,
    };
}
