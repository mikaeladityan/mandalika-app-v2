import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductImportService } from "../server/import.service";
import { ResponseProductImportDTO } from "./import.schema";

export function usePreviewImportProduct() {
    return useMutation<ResponseProductImportDTO, Error, File>({
        mutationFn: ProductImportService.preview,
    });
}

export function useGetPreviewImport() {
    return useMutation({
        mutationFn: (importId: string) => ProductImportService.getPreview(importId),
    });
}

export function useExecuteImportProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (importId: string) => ProductImportService.execute(importId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"], type: "all" }),
    });
}
