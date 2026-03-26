import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OpenPoService } from "./po-open.service";
import { QueryOpenPoDTO, RequestUpdateOpenPoDTO } from "./po-open.schema";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const useOpenPoTableState = () => {
    const [page, setPage] = useLocalStorage("po-open-page", 1);
    const [take, setTake] = useLocalStorage("po-open-take", 20);
    const [search, setSearch] = useLocalStorage("po-open-search", "");
    const [status, setStatus] = useLocalStorage("po-open-status", "OPEN");

    const [month, setMonth] = useLocalStorage<number>("po-open-month", new Date().getMonth() + 1);
    const [year, setYear] = useLocalStorage<number>("po-open-year", new Date().getFullYear());

    const queryParams: QueryOpenPoDTO = {
        page,
        take,
        status,
        ...(search && { search }),
        ...(month && { month }),
        ...(year && { year }),
    };

    return {
        page,
        take,
        search,
        status,
        month,
        year,
        setPage,
        setTake,
        setSearch,
        setStatus,
        setMonth,
        setYear,
        queryParams,
    };
};

export const useOpenPo = (query: QueryOpenPoDTO) => {
    const list = useQuery({
        queryKey: ["open-po", query],
        queryFn: () => OpenPoService.list(query),
    });

    return { list };
};

export const useOpenPoSummary = (query: QueryOpenPoDTO) => {
    const summary = useQuery({
        queryKey: ["open-po-summary", query],
        queryFn: () => OpenPoService.getSummary(query),
    });

    return { summary };
};

export const useActionUpdateOpenPo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, body }: { id: number; body: RequestUpdateOpenPoDTO }) => {
            return await OpenPoService.update(id, body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["open-po"] });
            queryClient.invalidateQueries({ queryKey: ["open-po-summary"] });
            queryClient.invalidateQueries({ queryKey: ["recomendation"] });
        },
    });
};
