import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { RecomendationService } from "./recomendation.service";
import { QueryRecomendationDTO } from "./recomendation.schema";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError } from "@/lib/utils/error";

export const useRecomendationTableState = (opts?: { defaultType?: "ffo" | "lokal" | "impor" }) => {
    const [page, setPage] = useState(1);
    const [take, setTake] = useState(50);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<"ffo" | "lokal" | "impor" | undefined>(opts?.defaultType);

    // For manual dates
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [period, setPeriod] = useState<Date>(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    );

    const queryParams: QueryRecomendationDTO = {
        page,
        take,
        ...(search && { search }),
        ...(month && { month }),
        ...(year && { year }),
        ...(period && { period }),
        ...(type && { type }),
    };

    return {
        page,
        take,
        search,
        month,
        year,
        period,
        setPage,
        setTake,
        setSearch,
        setMonth,
        setYear,
        setPeriod,
        queryParams,
    };
};

export const useRecomendation = (query: QueryRecomendationDTO) => {
    const list = useQuery({
        queryKey: ["recomendation", query],
        queryFn: () => RecomendationService.list(query),
    });

    return { list };
};

export const useActionSaveOrder = () => {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    return useMutation({
        mutationFn: async (body: {
            raw_mat_id: number;
            month: number;
            year: number;
            period?: Date | string;
            quantity: number;
        }) => {
            const { data } = await api.post("/api/app/recomendations/order", body);
            return data;
        },
        onSuccess: () => {
            setNotif({
                title: "Simpan Draft",
                message: "Berhasil menyimpan draft order quantity",
            });
            queryClient.invalidateQueries({ queryKey: ["recomendation"] });
            queryClient.invalidateQueries({ queryKey: ["purchase"] });
        },
        onError: (err: any) => {
            FetchError(err, setErr);
        },
    });
};

export const useApproveRecomendation = () => {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    return useMutation({
        mutationFn: async (body: { id: number; status: "ACC" }) => {
            const { data } = await api.post("/api/app/recomendations/approve", body);
            return data;
        },
        onSuccess: () => {
            setNotif({
                title: "Approve Rekomendasi",
                message: "Berhasil menyetujui rekomendasi dan push ke PO Open",
            });
            queryClient.invalidateQueries({ queryKey: ["recomendation"] });
            queryClient.invalidateQueries({ queryKey: ["open-po"] });
        },
        onError: (err: any) => {
            FetchError(err, setErr);
        },
    });
};

export const useDeleteRecomendation = () => {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.delete(`/api/app/recomendations/${id}`);
            return data;
        },
        onSuccess: () => {
            setNotif({
                title: "Hapus Draft",
                message: "Berhasil menghapus draft rekomendasi",
            });
            queryClient.invalidateQueries({ queryKey: ["purchase"] });
            queryClient.invalidateQueries({ queryKey: ["recomendation"] });
        },
        onError: (err: any) => {
            FetchError(err, setErr);
        },
    });
};
