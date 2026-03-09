import { useMutation } from "@tanstack/react-query";
import { ResponseRawmatImportDTO } from "./import.schema";
import { RawmatImportService } from "./import.service";

export function usePreviewImportRawmat() {
    return useMutation<ResponseRawmatImportDTO, Error, File>({
        mutationFn: RawmatImportService.preview,
    });
}

export function useGetPreviewImport() {
    return useMutation({
        mutationFn: (importId: string) => RawmatImportService.getPreview(importId),
    });
}

export function useExecuteImportRawmat() {
    return useMutation({
        mutationFn: ({ importId }: { importId: string }) => RawmatImportService.execute(importId),
    });
}
