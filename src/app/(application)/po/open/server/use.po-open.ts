import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { OpenPoService } from "./po-open.service";
import { QueryOpenPoDTO, RequestUpdateOpenPoDTO } from "./po-open.schema";

export const useOpenPoTableState = () => {
    const [page, setPage] = useState(1);
    const [take, setTake] = useState(20);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("OPEN");

    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

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

export const useActionUpdateOpenPo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, body }: { id: number; body: RequestUpdateOpenPoDTO }) => {
            return await OpenPoService.update(id, body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["open-po"] });
            queryClient.invalidateQueries({ queryKey: ["recomendation"] });
        },
    });
};
