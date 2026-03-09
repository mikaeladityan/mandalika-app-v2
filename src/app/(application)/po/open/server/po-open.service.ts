import { api } from "@/lib/api";
import { QueryOpenPoDTO, RequestUpdateOpenPoDTO, OpenPoResponse } from "./po-open.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/po/open`;

export class OpenPoService {
    static async list(query: QueryOpenPoDTO) {
        const { data } = await api.get(API, { params: query });
        return data.data as {
            data: OpenPoResponse[];
            meta: {
                total: number;
                page: number;
                take: number;
            };
        };
    }

    static async update(id: number, body: RequestUpdateOpenPoDTO) {
        const { data } = await api.patch(`${API}/${id}`, body);
        return data;
    }
}
