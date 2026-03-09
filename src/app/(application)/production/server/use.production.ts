import { FetchError, ResponseError } from "@/lib/utils/error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RequestSyncProductionDTO } from "./production.schema";
import { ProductionService } from "./production.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";

export function useSyncProduction() {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    return useMutation<unknown, ResponseError, RequestSyncProductionDTO>({
        mutationKey: ["sync", "production"],
        mutationFn: (body) => ProductionService.sync(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forecast"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["products", "productions"], type: "all" });
            setNotif({
                title: "Proses Kalkulasi Produksi",
                message: "Proses kalkulasi berhasil dilakukan",
            });
        },
        onError: (err) => FetchError(err, setErr),
    });
}

export function useBulkProduction(params?: { month?: number; year?: number }) {
    const queryClient = useQueryClient();
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    return useMutation<unknown, ResponseError>({
        mutationKey: ["bulk", "production"],
        mutationFn: () => ProductionService.bulk(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forecast"], type: "all" });
            queryClient.invalidateQueries({ queryKey: ["products", "productions"], type: "all" });
            setNotif({
                title: "Proses Kalkulasi Produksi",
                message: "Proses kalkulasi berhasil dilakukan",
            });
        },
        onError: (err) => FetchError(err, setErr),
    });
}
