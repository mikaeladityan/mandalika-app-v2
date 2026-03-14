import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks";
import {
    QueryRecomendationV2DTO,
    RequestApproveWorkOrderDTO,
    RequestSaveWorkOrderDTO,
    RequestBulkSaveHorizonDTO
} from "./recomendation-v2.schema";
import { RecomendationV2Service } from "./recomendation-v2.service";
import { toast } from "sonner";

/** Hitung total kebutuhan berdasarkan horizon bulan. */
export function calculateTotalNeeded(
    needs: Array<{ quantity?: number }>,
    horizon: number,
): number {
    if (horizon <= 0) return 0;
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
        }
    });

    const approveOrder = useMutation({
        mutationFn: (body: RequestApproveWorkOrderDTO) => RecomendationV2Service.approveWorkOrder(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil di-approve (PO Terbit)");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal meng-approve Work Order");
        }
    });

    const deleteOrder = useMutation({
        mutationFn: (id: number) => RecomendationV2Service.destroyWorkOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Work Order berhasil dihapus");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menghapus Work Order");
        }
    });

    const bulkSaveHorizon = useMutation({
        mutationFn: (body: RequestBulkSaveHorizonDTO) => RecomendationV2Service.bulkSaveHorizon(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recomendation-v2"] });
            toast.success("Bulk Horizon berhasil dijalankan");
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menjalankan Bulk Horizon");
        }
    });

    return { list, saveOrder, approveOrder, deleteOrder, bulkSaveHorizon };
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
        mutationFn: (body: RequestApproveWorkOrderDTO) => RecomendationV2Service.approveWorkOrder(body),
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

    return { saveOrder, approveOrder, deleteOrder };
}

export function useRecomendationV2TableState(initial?: { defaultType?: "ffo" | "lokal" | "impor" }) {
    const [page, setPage] = useState(1);
    const [take, setTake] = useState(25);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [type, setType] = useState<"ffo" | "lokal" | "impor" | undefined>(initial?.defaultType);
    const [salesMonths, setSalesMonths] = useState(3);
    const [forecastMonths, setForecastMonths] = useState(3);

    const queryParams: QueryRecomendationV2DTO = {
        page,
        take,
        search: debouncedSearch,
        month,
        year,
        type,
        sales_months: salesMonths,
        forecast_months: forecastMonths,
    };

    const reset = () => {
        setPage(1);
        setSearch("");
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setSalesMonths(3);
        setForecastMonths(3);
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
        salesMonths,
        setSalesMonths,
        forecastMonths,
        setForecastMonths,
        queryParams,
        reset,
    };
}
