import api, { JWT_STORAGE_KEY, USER_STORAGE_KEY } from "./api";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    email: string;
    message?: string;
}

export interface User {
    userId: number;
    email: string;
}

const authService = {
    // Đăng ký
    register: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", data);
        if (response.data.token) {
            localStorage.setItem(JWT_STORAGE_KEY, response.data.token);
            localStorage.setItem(
                USER_STORAGE_KEY,
                JSON.stringify({
                    userId: response.data.userId,
                    email: response.data.email,
                })
            );
        }
        return response.data;
    },

    // Đăng nhập
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        if (response.data.token) {
            localStorage.setItem(JWT_STORAGE_KEY, response.data.token);
            localStorage.setItem(
                USER_STORAGE_KEY,
                JSON.stringify({
                    userId: response.data.userId,
                    email: response.data.email,
                })
            );
        }
        return response.data;
    },

    // Quên mật khẩu
    forgotPassword: async (email: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(
            "/auth/forgot-password",
            { email }
        );
        return response.data;
    },

    // Đặt lại mật khẩu
    resetPassword: async (
        token: string,
        newPassword: string
    ): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(
            "/auth/reset-password",
            {
                token,
                newPassword,
            }
        );
        return response.data;
    },

    // Đăng xuất
    logout: (): void => {
        localStorage.removeItem(JWT_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    },

    // Lấy thông tin người dùng hiện tại
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(USER_STORAGE_KEY);
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    // Kiểm tra đã đăng nhập chưa
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(JWT_STORAGE_KEY);
    },
};

export default authService;
