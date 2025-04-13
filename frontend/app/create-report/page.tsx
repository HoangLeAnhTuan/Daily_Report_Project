"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ReportForm from "../components/ReportForm";
import { toast } from "react-toastify";

export default function CreateReportPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const handleReportAdded = () => {
        // Sau khi tạo báo cáo thành công, chuyển hướng về trang chủ để xem danh sách
        toast.success("Báo cáo đã được tạo thành công!");
        router.push("/");
    };

    // Kiểm tra xác thực
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                Đang tải...
            </div>
        );
    }

    return (
        <div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">Tạo báo cáo mới</h1>
                <p className="text-lg">
                    Điền thông tin chi tiết về công việc của bạn
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <ReportForm onReportAdded={handleReportAdded} />
            </div>
        </div>
    );
}
