import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce, useQueryParams } from "@/shared/hooks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FORECAST_HORIZON_KEY } from "@/app/(application)/forecasts/server/use.forecast";
import {
    QueryRecomendationV2DTO,
    RequestApproveWorkOrderDTO,
    RequestSaveWorkOrderDTO,
    RequestBulkSaveHorizonDTO,
    RequestSaveOpenPoDTO,
} from "./recomendation-v2.schema";
import { RecomendationV2Service } from "./recomendation-v2.service";
import { toast } from "sonner";

/** Hitung total kebutuhan berdasarkan horizon bulan. */
export function calculateTotalNeeded(needs: Array<{ quantity?: number }>, horizon: number): number | null {
    if (horizon <= 0 || !needs || needs.length === 0) return null;
    return needs.slice(0, horizon).reduce((sum, n) => sum + (n.quantity || 0), 0);
}

export function useRecomendationV2(params: QueryRecomendationV2DTO) {
    const queryClient = useQueryClient();

    const list = useQuery({
        queryKey: ["recomendation-v2", params],
        queryFn: () => RecomendationV2Service.list(params),
    });

    const saveOrder = useMutation({
        mutationFn: (body: RequestSaveWorkOrderDTO) => RecomendationV2Service.saveWorkOrder(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil disimpan");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menyimpan Work Order");
        },
    });

    const approveOrder = useMutation({
        mutationFn: (body: RequestApproveWorkOrderDTO) =>
            RecomendationV2Service.approveWorkOrder(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil di-approve (PO Terbit)");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal meng-approve Work Order");
        },
    });

    const deleteOrder = useMutation({
        mutationFn: (id: number) => RecomendationV2Service.destroyWorkOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil dihapus");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menghapus Work Order");
        },
    });

    const bulkSaveHorizon = useMutation({
        mutationFn: (body: RequestBulkSaveHorizonDTO) =>
            RecomendationV2Service.bulkSaveHorizon(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Bulk Horizon berhasil dijalankan");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menjalankan Bulk Horizon");
        },
    });

    const exportData = useMutation({
        mutationFn: (params: QueryRecomendationV2DTO) => RecomendationV2Service.export(params),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Rekomendasi_V2_${params.type?.toUpperCase()}_${params.month}_${params.year}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Data berhasil diekspor");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal mengekspor data");
        },
    });

    const saveOpenPo = useMutation({
        mutationFn: (body: RequestSaveOpenPoDTO) => RecomendationV2Service.saveOpenPo(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Open PO berhasil diperbarui");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal memperbarui Open PO");
        },
    });

    return {
        list,
        saveOrder,
        approveOrder,
        deleteOrder,
        bulkSaveHorizon,
        saveOpenPo,
        exportData,
    };
}

/**
 * Mutations-only hook — tidak trigger list query.
 * Gunakan ini di dalam dialog/row agar tidak ada N query tambahan per baris tabel.
 */
export function useRecomendationV2Mutations() {
    const queryClient = useQueryClient();

    const saveOrder = useMutation({
        mutationFn: (body: RequestSaveWorkOrderDTO) => RecomendationV2Service.saveWorkOrder(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil disimpan");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menyimpan Work Order");
        },
    });

    const approveOrder = useMutation({
        mutationFn: (body: RequestApproveWorkOrderDTO) =>
            RecomendationV2Service.approveWorkOrder(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil di-approve (PO Terbit)");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal meng-approve Work Order");
        },
    });

    const deleteOrder = useMutation({
        mutationFn: (id: number) => RecomendationV2Service.destroyWorkOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil dihapus");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menghapus Work Order");
        },
    });

    const saveOpenPo = useMutation({
        mutationFn: (body: RequestSaveOpenPoDTO) => RecomendationV2Service.saveOpenPo(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Open PO berhasil diperbarui");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal memperbarui Open PO");
        },
    });

    return { saveOrder, approveOrder, deleteOrder, saveOpenPo };
}

export function useRecomendationV2TableState(initial?: {
    defaultType?: "ffo" | "lokal" | "impor";
}) {
    const { get, batchSet, searchParams } = useQueryParams();

    // Local state for immediate input feedback
    // Search input (local state)
    const [search, setSearch] = useState(get("search") ?? "");
    const debouncedSearch = useDebounce(search, 500);

    const page = Number(get("page") ?? 1);
    const take = Number(get("take") ?? 50);
    const month = Number(get("month") ?? new Date().getMonth() + 1);
    const year = Number(get("year") ?? new Date().getFullYear());
    const type = (get("type") as any) || initial?.defaultType || "ffo";
    const sales_months = Number(get("sales_months") ?? 3);
    const sortBy = get("sortBy") || undefined;
    const order = (get("order") as "asc" | "desc") || undefined;

    const fcHorizonKey = `RECOM_HORIZON_FC_${type.toUpperCase()}`;
    const poHorizonKey = `RECOM_HORIZON_PO_${type.toUpperCase()}`;
    
    const [forecastMonths, setForecastMonths] = useLocalStorage<number>(fcHorizonKey, Number(get("forecast_months") ?? 4));
    const [poMonths, setPoMonths] = useLocalStorage<number>(poHorizonKey, Number(get("po_months") ?? 4));

    // Sync forecastMonths with localStorage when type changes
    useEffect(() => {
        const stored = window.localStorage.getItem(fcHorizonKey);
        if (stored) {
            try {
                setForecastMonths(JSON.parse(stored));
            } catch (e) {
                setForecastMonths(4);
            }
        } else {
            setForecastMonths(4);
        }
    }, [type, fcHorizonKey, setForecastMonths]);

    // Sync poMonths with localStorage when type changes
    useEffect(() => {
        const stored = window.localStorage.getItem(poHorizonKey);
        if (stored) {
            try {
                setPoMonths(JSON.parse(stored));
            } catch (e) {
                setPoMonths(4);
            }
        } else {
            setPoMonths(4);
        }
    }, [type, poHorizonKey, setPoMonths]);

    // Sync URL when debouncedSearch change
    useEffect(() => {
        batchSet({
            search: debouncedSearch || undefined,
            page: "1",
        });
    }, [debouncedSearch]);

    const setPage = (p: number) => batchSet({ page: String(p) });
    const setTake = (t: number) => batchSet({ take: String(t), page: "1" });
    const setMonth = (m: number) => batchSet({ month: String(m), page: "1" });
    const setYear = (y: number) => batchSet({ year: String(y), page: "1" });
    const setType = (t: string) => batchSet({ type: t, page: "1" });
    const setSalesMonths = (s: number) => batchSet({ sales_months: String(s), page: "1" });
    
    const updateForecastMonths = (val: number) => {
        setForecastMonths(val);
        batchSet({ forecast_months: String(val), page: "1" });
    };

    const updatePoMonths = (val: number) => {
        setPoMonths(val);
        batchSet({ po_months: String(val), page: "1" });
    };

    const setSorting = (s?: string, o?: "asc" | "desc") => 
        batchSet({ sortBy: s || undefined, order: o || undefined, page: "1" });

    const queryParams: QueryRecomendationV2DTO = {
        page,
        take,
        search: get("search") ?? undefined,
        month,
        year,
        type,
        sales_months,
        forecast_months: forecastMonths,
        po_months: poMonths,
        sortBy,
        order,
    };

    const reset = () => {
        setSearch("");
        batchSet({
            search: undefined,
            page: "1",
            month: String(new Date().getMonth() + 1),
            year: String(new Date().getFullYear()),
            sales_months: "3",
            sortBy: undefined,
            order: undefined,
        });
    };

    return {
        page,
        setPage,
        take,
        setTake,
        search,
        setSearch,
        month,
        setMonth,
        year,
        setYear,
        type,
        setType,
        salesMonths: sales_months,
        setSalesMonths,
        forecastMonths,
        setForecastMonths: updateForecastMonths,
        poMonths,
        setPoMonths: updatePoMonths,
        sortBy,
        order,
        setSorting,
        queryParams,
        reset,
    };
}
