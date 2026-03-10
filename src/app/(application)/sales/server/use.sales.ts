import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuerySalesDTO, RequestSalesDTO } from "./sales.schema";
import { QueryDetailSale, SalesService } from "./sales.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useRouter } from "next/navigation";

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
        isError: list.isError || detail.isError,
        refetch: list.refetch || detail.refetch,
        productsOption,
    };
};

export function useSaleTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    // Search Logic
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    // Filters Logic
    const [gender, setGender] = useState<any>(get("gender") ?? undefined);
    const [size, setSize] = useState<number | undefined>(
        get("size") ? Number(get("size")) : undefined,
    );
    const [variant, setVariant] = useState<string | undefined>(get("variant") ?? undefined);
    const [horizon, setHorizon] = useState<number | undefined>(
        get("horizon") ? Number(get("horizon")) : undefined,
    );

    const [product_id, setProductId] = useState<number | undefined>(
        get("product_id") ? Number(get("product_id")) : undefined,
    );
    const [product_id_2, setProductId2] = useState<number | undefined>(
        get("product_id_2") ? Number(get("product_id_2")) : undefined,
    );

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            gender: gender || undefined,
            size: size ? String(size) : undefined,
            variant: variant || undefined,
            horizon: horizon ? String(horizon) : undefined,
            product_id: product_id ? String(product_id) : undefined,
            product_id_2: product_id_2 ? String(product_id_2) : undefined,
            page: "1",
        });
    }, [debouncedSearch, gender, size, variant, horizon, product_id, product_id_2]);

    // Sorting Logic
    const sortBy = get("sortBy") ?? "quantity";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: nextOrder, page: "1" });
        },
        [sortBy, sortOrder, batchSet],
    );

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    const queryParams = useMemo<QuerySalesDTO>(
        () => ({
            take: Number(get("take") ?? 25),
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
        ],
    );

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
        sortBy,
        sortOrder,
        onSort,
        queryParams,
        setPage,
        setPageSize,
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
