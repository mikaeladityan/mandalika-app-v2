import { useMutation, useQuery } from "@tanstack/react-query";
import { DiscrepancyService } from "./discrepancy.service";
import { QueryDiscrepancyDTO, ResponseDiscrepancyDTO } from "./discrepancy.schema";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";

export function useDiscrepancy(params?: QueryDiscrepancyDTO) {
    const list = useQuery({
        queryKey: ["discrepancies", params],
        queryFn: () => DiscrepancyService.list(params as QueryDiscrepancyDTO),
        enabled: !!params,
    });

    return {
        data: list.data?.data ?? [],
        meta: list.data,
        isLoading: list.isLoading,
        isFetching: list.isFetching,
        isError: list.isError,
        refetch: list.refetch,
    };
}

export function useExportDiscrepancy() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const exportMutation = useMutation<void, ResponseError, QueryDiscrepancyDTO>({
        mutationKey: ["discrepancies", "export"],
        mutationFn: (params) => DiscrepancyService.export(params),
        onSuccess: () => {
            setNotif({ title: "Export", message: "Data Selisih (Discrepancy) berhasil diunduh" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        exportData: exportMutation.mutate,
        isExporting: exportMutation.isPending,
    };
}

export function useDiscrepancyTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    const queryParams = useMemo<QueryDiscrepancyDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        queryParams,
        setPage,
        setPageSize,
    };
}
