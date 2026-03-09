import { useQuery } from "@tanstack/react-query";
import { SharedService } from "./shared.service";

export function useWarehouses() {
    return useQuery({
        queryKey: ["warehouse", "shareds"],
        queryFn: () => SharedService.getWarehouses(),
    });
}
