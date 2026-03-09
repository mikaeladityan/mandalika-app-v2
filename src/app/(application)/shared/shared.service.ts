import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { ResponseWarehouseDTO } from "../warehouses/server/warehouse.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/shared/warehouses`;
export class SharedService {
    static async getWarehouses() {
        try {
            const { data } =
                await api.get<
                    ApiSuccessResponse<Array<Pick<ResponseWarehouseDTO, "name" | "id" | "type">>>
                >(API);

            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
