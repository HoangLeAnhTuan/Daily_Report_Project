"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import authService, {
    User,
    LoginRequest,
    AuthResponse,
} from "../services/authService";
import { useRouter } from "next/navigation";
import { JWT_STORAGE_KEY, USER_STORAGE_KEY } from "../services/api";

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<AuthResponse>;
    register: (data: LoginRequest) => Promise<AuthResponse>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Biến môi trường
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Daily Report";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Khi component mount, kiểm tra nếu người dùng đã đăng nhập
        const checkAuth = () => {
            setLoading(true);
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();

        // Set document title
        document.title = APP_NAME;
    }, []);

    const login = async (data: LoginRequest): Promise<AuthResponse> => {
        setLoading(true);
        try {
            const response = await authService.login(data);
            setUser({
                userId: response.userId,
                email: response.email,
            });
            setIsAuthenticated(true);
            return response;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: LoginRequest): Promise<AuthResponse> => {
        setLoading(true);
        try {
            const response = await authService.register(data);
            setUser({
                userId: response.userId,
                email: response.email,
            });
            setIsAuthenticated(true);
            return response;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
