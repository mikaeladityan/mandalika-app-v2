import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";

export interface StockCheckResponse {
    quantity: number;
    min_stock: number | null;
    location_name: string;
}

export function useStockCheck(productId: number, locationType: "WAREHOUSE" | "OUTLET" | undefined, locationId: number | undefined) {
    return useQuery({
        queryKey: ["stock-check", productId, locationType, locationId],
        queryFn: async () => {
            if (!productId || !locationType || !locationId) return null;
            
            const url =
                locationType === "WAREHOUSE"
                    ? `/api/app/warehouses/${locationId}/stock/${productId}`
                    : `/api/app/outlets/${locationId}/inventory/${productId}`;
                
            const res = await api.get<ApiSuccessResponse<StockCheckResponse>>(url);
            return res.data.data;
        },
        enabled: !!productId && !!locationType && !!locationId,
        staleTime: 30000, // 30 seconds
    });
}
