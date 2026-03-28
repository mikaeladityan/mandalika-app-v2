import { useMutation, useQuery } from "@tanstack/react-query";
import { ConsolidationService } from "./consolidation.service";
import { QueryConsolidationDTO } from "./consolidation.schema";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const useConsolidationTableState = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Persist basic filters
    const [page, setPage] = useLocalStorage("consolidation-page", 1);
    const [take, setTake] = useLocalStorage("consolidation-take", 25);
    const [search, setSearch] = useLocalStorage("consolidation-search", "");
    const [month, setMonth] = useLocalStorage<number>(
        "consolidation-month",
        new Date().getMonth() + 1,
    );
    const [year, setYear] = useLocalStorage<number>(
        "consolidation-year",
        new Date().getFullYear(),
    );

    // Read sorting from URL
    const sortBy = searchParams.get("sortBy") || undefined;
    const order = (searchParams.get("order") as "asc" | "desc") || undefined;

    const setSorting = useCallback(
        (newSortBy: string | undefined, newOrder: "asc" | "desc" | undefined) => {
            const params = new URLSearchParams(searchParams.toString());
            if (newSortBy && newOrder) {
                params.set("sortBy", newSortBy);
                params.set("order", newOrder);
            } else {
                params.delete("sortBy");
                params.delete("order");
            }
            router.push(`?${params.toString()}`, { scroll: false });
        },
        [searchParams, router],
    );

    const queryParams: QueryConsolidationDTO = {
        page,
        take,
        ...(search && { search }),
        ...(month && { month }),
        ...(year && { year }),
        ...(sortBy && { sortBy }),
        ...(order && { order }),
    };

    return {
        page,
        take,
        search,
        month,
        year,
        sortBy,
        order,
        setPage,
        setTake,
        setSearch,
        setMonth,
        setYear,
        setSorting,
        queryParams,
    };
};

export const useConsolidation = (query: QueryConsolidationDTO) => {
    const list = useQuery({
        queryKey: ["consolidation", query],
        queryFn: () => ConsolidationService.list(query),
    });

    const exportData = useMutation({
        mutationFn: (exportQuery: QueryConsolidationDTO) => ConsolidationService.export(exportQuery),
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            const filename = `Konsolidasi_Purchase_${query.month || new Date().getMonth() + 1}_${query.year || new Date().getFullYear()}.xlsx`;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Berhasil mengekspor data");
        },
        onError: () => {
            toast.error("Gagal mengekspor data");
        },
    });

    return { list, exportData };
};

export const useConsolidationSummary = (query: QueryConsolidationDTO) => {
    const summary = useQuery({
        queryKey: ["consolidation-summary", query],
        queryFn: () => ConsolidationService.getSummary(query),
    });

    return { summary };
};
