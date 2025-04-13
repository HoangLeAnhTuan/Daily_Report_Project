"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import reportService, { Report, PagedResponse } from "./services/reportService";
import tagService, { Tag } from "./services/tagService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ReportModal from "./components/ReportModal";

export default function Home() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [totalReports, setTotalReports] = useState<number>(0);
    const today = format(new Date(), "yyyy-MM-dd");

    // Phân trang
    const [currentPage, setCurrentPage] = useState(0); // API sử dụng 0-based indexing
    const [reportsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Modal hiển thị chi tiết báo cáo
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Nếu không đăng nhập và đã hoàn thành kiểm tra, chuyển hướng đến trang đăng nhập
        if (!loading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Đảm bảo ngày đã chọn không phải là ngày trong tương lai
            const today = format(new Date(), "yyyy-MM-dd");
            if (new Date(selectedDate) > new Date(today)) {
                setSelectedDate(today);
                return;
            }

            fetchReportsPaged();
            fetchTags();
            fetchTotalReports();
        }
    }, [
        isAuthenticated,
        user,
        selectedDate,
        selectedTagId,
        currentPage,
        reportsPerPage,
    ]);

    const fetchReportsPaged = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response: PagedResponse = await reportService.getReportsPaged(
                user.userId,
                currentPage,
                reportsPerPage,
                selectedDate || undefined,
                selectedTagId || undefined
            );

            setReports(response.reports);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Không thể lấy danh sách báo cáo");
            // Đặt giá trị mặc định
            setReports([]);
            setTotalPages(0);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const fetchedTags = await tagService.getAllTags();
            setTags(fetchedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const fetchTotalReports = async () => {
        if (!user) return;

        try {
            const count = await reportService.countReports(user.userId);
            setTotalReports(count);
        } catch (error) {
            console.error("Error fetching total reports:", error);
        }
    };

    const handleReportAdded = () => {
        fetchReportsPaged();
        fetchTotalReports();
        // Reset về trang đầu tiên khi thêm báo cáo mới
        setCurrentPage(0);
    };

    const handleDeleteReport = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) return;

        try {
            await reportService.deleteReport(id);
            toast.success("Xóa báo cáo thành công");

            // Kiểm tra nếu trang hiện tại không còn báo cáo nào (sau khi xóa) thì quay lại trang trước đó
            if (reports.length === 1 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchReportsPaged(); // Tải lại dữ liệu trang hiện tại
            }

            fetchTotalReports();
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Xóa báo cáo thất bại");
        }
    };

    const getTagName = (tagId: number) => {
        const tag = tags.find((t) => t.id === tagId);
        return tag ? tag.name : "Unknown";
    };

    const getTagClassName = (tagName: string) => {
        switch (tagName.toLowerCase()) {
            case "important":
                return "tag-important";
            case "urgent":
                return "tag-urgent";
            default:
                return "tag-normal";
        }
    };

    // Format date to display in Vietnamese
    const formatDateVN = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "EEEE, dd/MM/yyyy", { locale: vi });
    };

    // Xử lý xem chi tiết báo cáo
    const handleViewReport = (report: Report) => {
        console.log("Opening modal for report:", report);
        setSelectedReport(report);
        setShowModal(true);
    };

    // Xử lý phân trang
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = () => {
        setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi bộ lọc
        fetchReportsPaged();
    };

    // Hiển thị các nút phân trang
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`mx-1 px-3 py-1 rounded-md ${
                            currentPage === 0
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        &laquo;
                    </button>

                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`mx-1 px-3 py-1 rounded-md ${
                                currentPage === number
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {number + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`mx-1 px-3 py-1 rounded-md ${
                            currentPage === totalPages - 1
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        &raquo;
                    </button>
                </nav>
            </div>
        );
    };

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
                <h1 className="text-3xl font-bold mb-2">
                    Báo cáo công việc hàng ngày
                </h1>
                <p className="text-xl">
                    Chào mừng{" "}
                    <span className="font-medium">
                        {user?.email?.split("@")[0]}
                    </span>
                    ! Bạn có tổng cộng {totalReports} báo cáo.
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold mb-4 md:mb-0">
                        Danh sách báo cáo
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    // Gọi hàm xử lý lọc sau khi cập nhật state
                                    setTimeout(handleFilterChange, 0);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tag
                            </label>
                            <select
                                value={selectedTagId || ""}
                                onChange={(e) => {
                                    setSelectedTagId(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    );
                                    // Gọi hàm xử lý lọc sau khi cập nhật state
                                    setTimeout(handleFilterChange, 0);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="">Tất cả</option>
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedDate(today);
                                setSelectedTagId(null);
                                setTimeout(handleFilterChange, 0);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors mt-6"
                        >
                            Hôm nay
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <p className="mt-2">Đang tải báo cáo...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-lg font-medium">
                            Không có báo cáo nào
                            {selectedDate ? ` vào ngày ${selectedDate}` : ""}
                            {selectedTagId ? ` với tag đã chọn` : ""}
                        </p>
                        <p className="mt-2">Tạo báo cáo mới ngay!</p>
                        <button
                            onClick={() => router.push("/create-report")}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Tạo báo cáo
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="text-right mb-4">
                            <p className="text-sm text-gray-600">
                                Hiển thị {reports.length} báo cáo (tổng số:{" "}
                                {totalItems}){" "}
                                {selectedDate
                                    ? `cho ngày ${formatDateVN(selectedDate)}`
                                    : ""}
                            </p>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tiêu đề
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tag
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tiến độ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giờ còn lại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.map((report) => {
                                    const tagName = getTagName(report.tagId);
                                    const tagClass = getTagClassName(tagName);

                                    return (
                                        <tr
                                            key={report.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() =>
                                                handleViewReport(report)
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {report.date}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="font-medium">
                                                    {report.title}
                                                </div>
                                                <div className="text-gray-600 mt-1 line-clamp-2">
                                                    {report.content}
                                                </div>
                                                {report.issue && (
                                                    <div className="mt-1">
                                                        <span className="text-red-600 font-medium">
                                                            Vấn đề:
                                                        </span>{" "}
                                                        {report.issue}
                                                        {report.solution && (
                                                            <span>
                                                                {" "}
                                                                →{" "}
                                                                <span className="text-green-600 font-medium">
                                                                    Giải pháp:
                                                                </span>{" "}
                                                                {
                                                                    report.solution
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`tag ${tagClass}`}
                                                >
                                                    {tagName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {report.progress}%
                                                </div>
                                                <div className="progress-bar mt-1 w-24">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${report.progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {report.remainingHours} giờ
                                            </td>
                                            <td
                                                className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteReport(
                                                            report.id!
                                                        );
                                                    }}
                                                    className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {renderPagination()}
                    </div>
                )}
            </div>

            {/* Modal hiển thị chi tiết báo cáo */}
            {selectedReport && showModal && (
                <ReportModal
                    key={selectedReport.id}
                    report={selectedReport}
                    isOpen={true}
                    onClose={() => {
                        console.log("Closing modal");
                        setShowModal(false);
                    }}
                    tagName={getTagName(selectedReport.tagId)}
                    tagClass={getTagClassName(getTagName(selectedReport.tagId))}
                />
            )}
        </div>
    );
}
