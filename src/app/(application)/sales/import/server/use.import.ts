import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseSalesImportDTO } from "./import.schema";
import { SalesImportService } from "./import.service";

export function usePreviewImportSales() {
    return useMutation<ResponseSalesImportDTO, Error, File>({
        mutationFn: SalesImportService.preview,
    });
}

export function useGetPreviewImport() {
    return useMutation({
        mutationFn: (importId: string) => SalesImportService.getPreview(importId),
    });
}

export function useExecuteImportSales() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            importId,
            month,
            year,
            type,
        }: {
            importId: string;
            month: number;
            year: number;
            type: string;
        }) => SalesImportService.execute(importId, month, year, type),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"], type: "all" }),
    });
}
