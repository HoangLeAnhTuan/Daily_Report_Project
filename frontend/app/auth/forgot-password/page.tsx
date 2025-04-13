"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "../../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            setIsSubmitted(true);
            toast.success(
                response.message || "Yêu cầu đặt lại mật khẩu đã được gửi"
            );
        } catch (error: any) {
            console.error("Forgot password error:", error);
            const errorMessage =
                error.response?.data?.message || "Gửi yêu cầu thất bại";
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
                        Quên mật khẩu
                    </h2>
                    {!isSubmitted ? (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng
                            dẫn đặt lại mật khẩu
                        </p>
                    ) : (
                        <p className="mt-2 text-center text-sm text-green-600">
                            Vui lòng kiểm tra email của bạn để nhận liên kết đặt
                            lại mật khẩu
                        </p>
                    )}
                </div>

                {!isSubmitted ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    : "Gửi yêu cầu đặt lại mật khẩu"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-6">
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Quay lại trang đăng nhập
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

export default ForgotPasswordPage;
