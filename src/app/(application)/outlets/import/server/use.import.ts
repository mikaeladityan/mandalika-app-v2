"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { OutletImportService } from "./import.service";
import { ResponseOutletImportDTO } from "./import.schema";

export function useOutletImportPage() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const preview = useMutation<ResponseOutletImportDTO, ResponseError, File>({
        mutationKey: ["outlets", "import", "preview-file"],
        mutationFn: (file) => OutletImportService.preview(file),
        onError: (err) => FetchError(err, setErr),
    });

    const getPreview = useMutation<any, ResponseError, string>({
        mutationKey: ["outlets", "import", "preview-get"],
        mutationFn: (importId: string) => OutletImportService.getPreview(importId),
        onError: (err) => FetchError(err, setErr),
    });

    const execute = useMutation<any, ResponseError, string>({
        mutationKey: ["outlets", "import", "execute"],
        mutationFn: (id) => OutletImportService.execute(id),
        onSuccess: () => {
            setNotif({
                title: "Import Berhasil",
                message: "Data outlet telah berhasil diimpor ke sistem",
            });
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (err) => FetchError(err, setErr),
    });

    return { preview, getPreview, execute };
}
