import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RawMaterialInventoryImportService } from "./import.service";
import { ResponseRawMaterialInventoryImportDTO } from "./import.schema";

export function usePreviewImportRawMaterialInventory() {
    return useMutation<ResponseRawMaterialInventoryImportDTO, Error, File>({
        mutationFn: RawMaterialInventoryImportService.preview,
    });
}

export function useGetPreviewImportRawMaterialInventory() {
    return useMutation({
        mutationFn: (importId: string) => RawMaterialInventoryImportService.getPreview(importId),
    });
}

export function useExecuteImportRawMaterialInventory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: {
            importId: string;
            warehouseId: number;
            date: number;
            month: number;
            year: number;
        }) =>
            RawMaterialInventoryImportService.execute(
                params.importId,
                params.warehouseId,
                params.date,
                params.month,
                params.year,
            ),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["rawmat", "stocks"], type: "all" }),
    });
}
