import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductInventoryImportService } from "./import.service";
import { ResponseProductInventoryImportDTO } from "./import.schema";

export function usePreviewImportProductInventory() {
    return useMutation<ResponseProductInventoryImportDTO, Error, File>({
        mutationFn: ProductInventoryImportService.preview,
    });
}

export function useGetPreviewImportProductInventory() {
    return useMutation({
        mutationFn: (importId: string) => ProductInventoryImportService.getPreview(importId),
    });
}

export function useExecuteImportProductInventory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: {
            importId: string;
            warehouseId: number;
            date: number;
            month: number;
            year: number;
        }) =>
            ProductInventoryImportService.execute(
                params.importId,
                params.warehouseId,
                params.date,
                params.month,
                params.year,
            ),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["warehouse"], type: "all" }),
    });
}
