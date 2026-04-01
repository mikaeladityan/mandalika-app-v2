import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReturnService } from "./return.service";
import { QueryReturnDTO, RequestReturnDTO, ResponseReturnDTO, UpdateReturnStatusDTO } from "./return.schema";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";

export function useReturn(params?: QueryReturnDTO) {
    const list = useQuery({
        queryKey: ["returns", params],
        queryFn: () => ReturnService.list(params as QueryReturnDTO),
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

export function useReturnDetail(id: number) {
    return useQuery({
        queryKey: ["returns", "detail", id],
        queryFn: () => ReturnService.detail(id),
        enabled: !!id,
    });
}

export function useReturnTableState() {
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
    const setStatus = (status?: string) => batchSet({ status, page: "1" });

    const queryParams = useMemo<QueryReturnDTO>(
        () => ({
            take: Number(get("take") ?? 25),
            page: Number(get("page") ?? 1),
            search: get("search") ?? undefined,
            status: get("status") ?? undefined,
        }),
        [searchParams],
    );

    return {
        search,
        setSearch,
        queryParams,
        setPage,
        setPageSize,
        setStatus,
    };
}

export function useFormReturn() {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    const createMutation = useMutation<ResponseReturnDTO, ResponseError, RequestReturnDTO>({
        mutationKey: ["returns", "create"],
        mutationFn: (payload) => ReturnService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["returns"] });
            setNotif({ title: "Berhasil", message: "Data Retur berhasil dibuat" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    const updateStatusMutation = useMutation<
        ResponseReturnDTO,
        ResponseError,
        { id: number; payload: UpdateReturnStatusDTO }
    >({
        mutationKey: ["returns", "updateStatus"],
        mutationFn: ({ id, payload }) => ReturnService.updateStatus(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["returns"] });
            setNotif({ title: "Berhasil", message: "Status Retur berhasil diperbarui" });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return {
        create: createMutation,
        updateStatus: updateStatusMutation,
    };
}
