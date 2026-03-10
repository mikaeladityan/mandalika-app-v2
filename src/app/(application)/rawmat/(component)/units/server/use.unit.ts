import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FetchError, ResponseError } from "@/lib/utils/error";
import { QueryRawMaterialUnitDTO, RequestRawMaterialUnitDTO } from "./unit.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusEnumDTO } from "@/shared/types";
import { UnitService } from "./unit.service";

export function useUnit(params?: QueryRawMaterialUnitDTO, id?: number) {
    const units = useQuery({
        queryKey: ["unit", params],
        queryFn: () => UnitService.list(params!),
        enabled: !!params && !id,
    });

    const unit = useQuery({
        queryKey: ["unit", id],
        queryFn: () => UnitService.detail(Number(id)),
        enabled: !params && !!id,
    });

    return { units, unit };
}

export function useFormUnit(id?: number) {
    const setNotif = useSetAtom(notificationAtom);
    const setErr = useSetAtom(errorAtom);
    const queryClient = useQueryClient();
    const create = useMutation<unknown, ResponseError, RequestRawMaterialUnitDTO>({
        mutationKey: ["unit", "create"],
        mutationFn: (body) => UnitService.create(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmaterial"], type: "all" });
            setNotif({
                title: "Tambah Unit/Satuan Raw Material",
                message: "Unit/Satuan raw material baru berhasil ditambahkan",
            });
        },
    });

    const update = useMutation<unknown, ResponseError, Partial<RequestRawMaterialUnitDTO>>({
        mutationKey: ["unit", "update"],
        mutationFn: (body) => UnitService.update(Number(id), body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmaterial"], type: "all" });
            setNotif({
                title: "Update Unit/Satuan Raw Material",
                message: "Unit/Satuan raw material berhasil diupdate",
            });
        },
    });

    const deleted = useMutation<unknown, ResponseError, { id: number }>({
        mutationKey: ["unit", "deleted"],
        mutationFn: ({ id }) => UnitService.delete(id),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["rawmaterial"], type: "all" });
            setNotif({
                title: "Hapus Unit/Satuan Raw Material",
                message: "Unit/Satuan raw material berhasil dihapus",
            });
        },
    });

    return { create, update, deleted };
}

export function useUnitTableState() {
    const { get, batchSet, searchParams } = useQueryParams();

    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        batchSet({ search: debouncedSearch || undefined, page: "1" });
    }, [debouncedSearch]);

    const sortBy = get("sortBy") ?? "name";
    const sortOrder = (get("sortOrder") as "asc" | "desc") ?? "desc";

    const onSort = useCallback(
        (key: string) => {
            const next = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
            batchSet({ sortBy: key, sortOrder: next, page: "1" });
        },
        [sortBy, sortOrder],
    );

    const setPage = (page: number) => batchSet({ page: String(page) });
    const setPageSize = (take: number) => batchSet({ take: String(take), page: "1" });

    const queryParams = useMemo<QueryRawMaterialUnitDTO>(
        () => ({
            page: Number(get("page") ?? 1),
            take: Number(get("take") ?? 25),
            search: get("search") ?? undefined,
            sortBy: sortBy as QueryRawMaterialUnitDTO["sortBy"],
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
        setPage,
        setPageSize,
    };
}

export function useUnitsQuery(params: QueryRawMaterialUnitDTO) {
    const query = useUnit(params);
    return {
        data: query.units.data?.data ?? [],
        meta: query.units,
    };
}
