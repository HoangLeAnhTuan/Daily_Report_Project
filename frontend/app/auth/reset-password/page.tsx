"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import authService from "../../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordPage: React.FC = () => {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Lấy token từ query parameter
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token không hợp lệ");
            return;
        }

        if (!password || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.resetPassword(token, password);
            setIsSuccess(true);
            toast.success(
                response.message || "Mật khẩu đã được đặt lại thành công"
            );
        } catch (error: any) {
            console.error("Reset password error:", error);
            const errorMessage =
                error.response?.data?.message || "Đặt lại mật khẩu thất bại";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đặt lại mật khẩu
                    </h2>
                    {!isSuccess ? (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Tạo mật khẩu mới cho tài khoản của bạn
                        </p>
                    ) : (
                        <p className="mt-2 text-center text-sm text-green-600">
                            Mật khẩu đã được đặt lại thành công!
                        </p>
                    )}
                </div>

                {!isSuccess ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="token" value={token} />

                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Mật khẩu mới
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Mật khẩu mới"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="sr-only"
                                >
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {isLoading
                                    ? "Đang xử lý..."
                                    : "Đặt lại mật khẩu"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-6">
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Đi đến trang đăng nhập
                        </button>
                    </div>
                )}

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        <Link
                            href="/auth/login"
                            className="font-medium text-primary hover:text-blue-600"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
