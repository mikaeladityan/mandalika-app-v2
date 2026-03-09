import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TypeService } from "./types.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { QueryTypeDTO, RequestTypeDTO, UpdateTypeDTO } from "./type.schema";

// ─── Query Hook ──────────────────────────────────────────────────────────────
export function useType(query?: QueryTypeDTO) {
    const list = useQuery({
        queryKey: ["types", query],
        queryFn: () => TypeService.list(query),
    });

    return {
        types: list,
        data: list.data?.data ?? [],
        len: list.data?.len ?? 0,
        isLoading: list.isLoading,
        isError: list.isError,
        isFetching: list.isFetching,
        isRefetching: list.isRefetching,
        refetch: list.refetch,
    };
}

// ─── Mutation Hook ───────────────────────────────────────────────────────────
export function useActionType() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["types"], type: "all" });

    const create = useMutation<unknown, ResponseError, RequestTypeDTO>({
        mutationKey: ["type", "create"],
        mutationFn: (body) => TypeService.create(body),
        onSuccess: () => {
            setNotif({ title: "Tambah Tipe", message: "Berhasil menambahkan tipe produk baru" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const update = useMutation<unknown, ResponseError, { id: number; body: UpdateTypeDTO }>({
        mutationKey: ["type", "update"],
        mutationFn: ({ id, body }) => TypeService.update(id, body),
        onSuccess: () => {
            setNotif({ title: "Update Tipe", message: "Berhasil memperbarui tipe produk" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    const remove = useMutation<unknown, ResponseError, number>({
        mutationKey: ["type", "delete"],
        mutationFn: (id) => TypeService.delete(id),
        onSuccess: () => {
            setNotif({ title: "Hapus Tipe", message: "Berhasil menghapus tipe produk" });
            invalidate();
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { create, update, remove };
}
