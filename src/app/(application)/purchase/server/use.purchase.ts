import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PurchaseService } from "./purchase.service";
import { QueryPurchaseDTO } from "./purchase.schema";

export const usePurchaseTableState = () => {
    const [page, setPage] = useState(1);
    const [take, setTake] = useState(25);
    const [search, setSearch] = useState("");

    // For manual dates
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

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
