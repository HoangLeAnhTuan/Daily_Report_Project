import axios from "axios";

// Lấy biến môi trường từ process.env
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";
const JWT_STORAGE_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "token";
const USER_STORAGE_KEY = process.env.NEXT_PUBLIC_USER_STORAGE_KEY || "user";
const ENABLE_DEBUG_LOGS = process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === "true";

// Log trong dev mode
if (ENABLE_DEBUG_LOGS) {
    console.log("API URL:", API_URL);
}

// Tạo instance axios với baseURL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor để thêm token vào header cho mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(JWT_STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (ENABLE_DEBUG_LOGS) {
            console.log("API Request:", {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
                headers: config.headers,
            });
        }

        return config;
    },
    (error) => {
        if (ENABLE_DEBUG_LOGS) {
            console.error("API Request Error:", error);
        }
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi từ response
api.interceptors.response.use(
    (response) => {
        if (ENABLE_DEBUG_LOGS) {
            console.log("API Response:", {
                status: response.status,
                data: response.data,
            });
        }
        return response;
    },
    (error) => {
        if (ENABLE_DEBUG_LOGS) {
            console.error("API Response Error:", error.response || error);
        }

        // Xử lý lỗi 401 (unauthorized) - đăng xuất user
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(JWT_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export { JWT_STORAGE_KEY, USER_STORAGE_KEY };
export default api;
