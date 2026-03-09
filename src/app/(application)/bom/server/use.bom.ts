import { FetchError, ResponseError } from "@/lib/utils/error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryBOMDTO, RequestBOMDTO } from "./bom.schema";
import { RecipeService } from "../../recipes/server/recipe.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useRouter } from "next/navigation";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useExplodeBOM() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation<unknown, ResponseError, RequestBOMDTO>({
        mutationKey: ["recipe", "BOM", "exploded"],
        mutationFn: (body) => RecipeService.explode(body),

        onError: (err) => FetchError(err, setErr),
        onSuccess: () => {
            setNotif({
                title: "Exploded BOM",
                message: "Berhasil generate data material requirement (BOM)",
            });
            queryClient.invalidateQueries({ queryKey: ["recipe"], type: "all" });
            router.replace("/bom");
        },
    });
}

export function useBOM(params: QueryBOMDTO) {
    return useQuery({
        queryKey: ["recipe", "bom", params],
        queryFn: () => RecipeService.bom(params),
    });
}
export function useDetailBOM(material_code: string, params?: { year: number; month: number }) {
    return useQuery({
        queryKey: ["recipe", "bom", material_code],
        queryFn: () => RecipeService.detailBOM(material_code, params!),
    });
}
export function useBOMTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    const sortBy = get("sortBy") ?? "exploded_at";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: nextOrder, page: "1" });
        },
        [sortBy, sortOrder],
    );

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    const queryParams = useMemo<QueryBOMDTO>(
        () => ({
            take: Number(get("take") ?? 500),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            sortBy: sortBy as any,
            sortOrder,
        }),
        [searchParams],
    );

    return { search, setSearch, sortBy, sortOrder, onSort, queryParams, setPage, setPageSize };
}

export function useBOMQuery(params: QueryBOMDTO) {
    const query = useQuery({
        queryKey: ["recipe", "bom", params],
        queryFn: () => RecipeService.bom(params),
    });

    return {
        items: query.data?.data ?? [],
        meta: query.data,
        ...query,
    };
}
