import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProductsQuery } from "../../products/server/use.products";
import { useRawMaterialsQuery } from "../../rawmat/server/use.rawmat";
import { QueryRecipeDTO, RequestRecipeDTO } from "./recipe.schema";
import { RecipeService } from "./recipe.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function useRecipe(params?: QueryRecipeDTO, id?: number) {
    const list = useQuery({
        queryKey: ["recipe", params],
        queryFn: () => RecipeService.list(params as QueryRecipeDTO),
        enabled: !!params && !id,
    });

    const detail = useQuery({
        queryKey: ["recipe", id],
        queryFn: () => RecipeService.detail(Number(id)),
        enabled: !params && !!id,
    });

    return {
        recipes: list.data,
        isLoading: list.isLoading,
        isFetching: list.isFetching,
        isRefetching: list.isRefetching,
        detail,
    };
}

export function useRecipeUtilsOption() {
    // Memperbesar limit `take` agar options mencakup semua data, terutama saat mode edit data karena
    // SelectForm saat ini bekerja secara client-side filter.
    const product = useProductsQuery({ page: 1, take: 5000, status: "ACTIVE", sortBy: "name", sortOrder: "asc" });
    const rawmat = useRawMaterialsQuery({ page: 1, take: 5000, status: "actived", sortBy: "name", sortOrder: "asc" });

    return { product, rawmat };
}

export function useFormRecipe() {
    const setNotif = useSetAtom(notificationAtom);
    const setErr = useSetAtom(errorAtom);
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<unknown, ResponseError, RequestRecipeDTO>({
        mutationKey: ["recipe", "upsert"],
        mutationFn: (body) => RecipeService.upsert(body),
        onError: (err) => FetchError(err, setErr),
        onSuccess: () => {
            setNotif({
                title: "Resep (BOM)",
                message: "Berhasil melakukan penamabahan ataupun perubahan data Resep (BOM)",
            });
            queryClient.invalidateQueries({ queryKey: ["recipe"], type: "all" });
            router.push("/recipes");
        },
    });
}

export function useRecipeTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debounced = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debounced || undefined, page: "1" });
    }, [debounced]);

    const sortBy = (get("sortBy") as QueryRecipeDTO["sortBy"]) ?? "product";
    const sortOrder = (get("sortOrder") as QueryRecipeDTO["sortOrder"]) ?? "asc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    const queryParams = useMemo<QueryRecipeDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 100),
            search: get("search") ?? undefined,
            sortBy,
            sortOrder,
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
        setPage: (page: number) => batchSet({ page: String(page) }),
        setPageSize: (take: number) => batchSet({ take: String(take), page: "1" }),
    };
}

export function useRecipeQuery(params: QueryRecipeDTO) {
    const query = useRecipe(params);

    return {
        data: query.recipes?.data ?? [],
        meta: query.recipes,
        ...query,
    };
}
