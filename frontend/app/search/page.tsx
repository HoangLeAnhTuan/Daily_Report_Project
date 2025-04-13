"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import reportService, {
    Report,
    PagedResponse,
} from "../services/reportService";
import tagService, { Tag } from "../services/tagService";
import { toast } from "react-toastify";

export default function SearchPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Report[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(0);
    const [reportsPerPage, setReportsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isPaged, setIsPaged] = useState(false);

    useEffect(() => {
        // Nếu không đăng nhập và đã hoàn thành kiểm tra, chuyển hướng đến trang đăng nhập
        if (!loading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchTags();
        }
    }, [isAuthenticated, user]);

    // Khi thay đổi trang và đã có kết quả tìm kiếm
    useEffect(() => {
        if (searchTerm && isPaged) {
            handleSearchPaged();
        }
    }, [currentPage]);

    const fetchTags = async () => {
        try {
            const fetchedTags = await tagService.getAllTags();
            setTags(fetchedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim() || !user) {
            setSearchResults([]);
            setIsPaged(false);
            return;
        }

        setIsLoading(true);
        try {
            const results = await reportService.searchReports(
                user.userId,
                searchTerm
            );
            setSearchResults(results);
            setIsPaged(false);
        } catch (error) {
            console.error("Error searching reports:", error);
            toast.error("Không thể tìm kiếm báo cáo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchPaged = async () => {
        if (!searchTerm.trim() || !user) {
            setSearchResults([]);
            setTotalPages(0);
            setTotalItems(0);
            return;
        }

        setIsLoading(true);
        try {
            const response = await reportService.searchReportsPaged(
                user.userId,
                searchTerm,
                currentPage,
                reportsPerPage
            );
            setSearchResults(response.reports);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
            setIsPaged(true);
        } catch (error) {
            console.error("Error searching reports with pagination:", error);
            toast.error("Không thể tìm kiếm báo cáo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReport = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) return;

        try {
            await reportService.deleteReport(id);
            toast.success("Xóa báo cáo thành công");

            // Nếu đang sử dụng phân trang, kiểm tra xem có cần quay lại trang trước không
            if (isPaged && searchResults.length === 1 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                // Tải lại kết quả tìm kiếm
                if (isPaged) {
                    handleSearchPaged();
                } else {
                    handleSearch();
                }
            }
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

    // Xử lý phân trang
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
                <h1 className="text-3xl font-bold mb-2">Tìm kiếm báo cáo</h1>
                <p className="text-lg">Tìm nhanh các báo cáo của bạn</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm theo tiêu đề, nội dung, vấn đề hoặc giải pháp..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        setCurrentPage(0);
                                        handleSearchPaged();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setCurrentPage(0);
                                    handleSearchPaged();
                                }}
                                className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                            >
                                Tìm kiếm
                            </button>
                            <select
                                value={reportsPerPage}
                                onChange={(e) => {
                                    setReportsPerPage(Number(e.target.value));
                                    if (searchTerm) {
                                        setCurrentPage(0);
                                        setTimeout(
                                            () => handleSearchPaged(),
                                            0
                                        );
                                    }
                                }}
                                className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="5">5 / trang</option>
                                <option value="10">10 / trang</option>
                                <option value="20">20 / trang</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <p className="mt-2">Đang tải dữ liệu...</p>
                    </div>
                ) : searchTerm && searchResults.length === 0 ? (
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
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <p className="text-lg font-medium">
                            Không tìm thấy báo cáo nào
                        </p>
                        <p className="mt-2">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div>
                        <div className="text-right mb-4">
                            <p className="text-sm text-gray-600">
                                Tìm thấy{" "}
                                {isPaged ? totalItems : searchResults.length}{" "}
                                báo cáo
                            </p>
                        </div>

                        <div className="overflow-x-auto">
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
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {searchResults.map((report) => {
                                        const tagName = getTagName(
                                            report.tagId
                                        );
                                        const tagClass =
                                            getTagClassName(tagName);

                                        return (
                                            <tr
                                                key={report.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {report.date}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="font-medium">
                                                        {report.title}
                                                    </div>
                                                    <div className="text-gray-600 mt-1">
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
                                                                        Giải
                                                                        pháp:
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteReport(
                                                                report.id!
                                                            )
                                                        }
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

                            {isPaged && renderPagination()}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
