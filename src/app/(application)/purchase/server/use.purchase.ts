import { useQuery } from "@tanstack/react-query";
import { PurchaseService } from "./purchase.service";
import { QueryPurchaseDTO } from "./purchase.schema";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const usePurchaseTableState = () => {
    const [page, setPage] = useLocalStorage("purchase-page", 1);
    const [take, setTake] = useLocalStorage("purchase-take", 25);
    const [search, setSearch] = useLocalStorage("purchase-search", "");

    // For manual dates
    const [month, setMonth] = useLocalStorage<number>(
        "purchase-month",
        new Date().getMonth() + 1,
    );
    const [year, setYear] = useLocalStorage<number>(
        "purchase-year",
        new Date().getFullYear(),
    );

    const queryParams: QueryPurchaseDTO = {
        page,
        take,
        ...(search && { search }),
        ...(month && { month }),
        ...(year && { year }),
    };

    return {
        page,
        take,
        search,
        month,
        year,
        setPage,
        setTake,
        setSearch,
        setMonth,
        setYear,
        queryParams,
    };
};

export const usePurchase = (query: QueryPurchaseDTO) => {
    const list = useQuery({
        queryKey: ["purchase", query],
        queryFn: () => PurchaseService.list(query),
    });

    return { list };
};

export const usePurchaseSummary = (query: QueryPurchaseDTO) => {
    const summary = useQuery({
        queryKey: ["purchase-summary", query],
        queryFn: () => PurchaseService.getSummary(query),
    });

    return { summary };
};
