import { api, setupCSRFToken } from "@/lib/api";
import { AuthAccountResponseDTO, LoginRequestDTO, RegisterRequestDTO } from "./schema";
import { ApiSuccessResponse } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/auth`;

export class AuthService {
    static async register(body: RegisterRequestDTO) {
        try {
            await setupCSRFToken();
            await api.post(`${API}/register`, body, {
                withCredentials: true,
            });
        } catch (error) {
            throw error;
        }
    }

    static async login(body: LoginRequestDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async logout() {
        try {
            await setupCSRFToken();
            await api.delete(API);
        } catch (error) {
            throw error;
        }
    }

    static async getAccount() {
        try {
            const { data } = await api.get<ApiSuccessResponse<AuthAccountResponseDTO>>(API);
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
