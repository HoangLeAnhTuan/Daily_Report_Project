"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";

const Navigation: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path
            ? "bg-primary text-white"
            : "hover:bg-gray-100";
    };

    // Tạo username từ email (phần trước @)
    const username = user?.email ? user.email.split("@")[0] : "";

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="text-xl font-bold text-primary"
                            >
                                Daily Report
                            </Link>
                        </div>
                        {isAuthenticated && (
                            <div className="ml-6 flex items-center space-x-4">
                                <Link
                                    href="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                                        "/"
                                    )}`}
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    href="/create-report"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                                        "/create-report"
                                    )}`}
                                >
                                    Tạo báo cáo
                                </Link>
                                <Link
                                    href="/search"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                                        "/search"
                                    )}`}
                                >
                                    Tìm kiếm
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center ml-4 md:ml-6">
                                <span className="mr-4 text-sm font-medium text-gray-700">
                                    {username}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    href="/auth/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                                        "/auth/login"
                                    )}`}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                                        "/auth/register"
                                    )}`}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
