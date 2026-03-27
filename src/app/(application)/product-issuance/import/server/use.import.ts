import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseIssuanceImportDTO } from "./import.schema";
import { IssuanceImportService } from "./import.service";

export function usePreviewImportIssuance() {
    return useMutation<ResponseIssuanceImportDTO, Error, File>({
        mutationFn: IssuanceImportService.preview,
    });
}

export function useGetPreviewImport() {
    return useMutation({
        mutationFn: (importId: string) => IssuanceImportService.getPreview(importId),
    });
}

export function useExecuteImportIssuance() {
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
        }) => IssuanceImportService.execute(importId, month, year, type),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issuance"], type: "all" }),
    });
}
