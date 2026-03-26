import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecipeImportService } from "./import.service";
import { ResponseRecipeImportDTO } from "./import.schema";

export function usePreviewImportRecipe() {
    return useMutation<ResponseRecipeImportDTO, Error, File>({
        mutationFn: RecipeImportService.preview,
    });
}

export function useGetPreviewImport() {
    return useMutation({
        mutationFn: (importId: string) => RecipeImportService.getPreview(importId),
    });
}

export function useExecuteImportRecipe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (importId: string) => RecipeImportService.execute(importId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipe"], type: "all" }),
    });
}
