"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import reportService, { Report } from "../services/reportService";
import tagService, { Tag } from "../services/tagService";
import { toast } from "react-toastify";

const ReportForm: React.FC<{ onReportAdded: () => void }> = ({
    onReportAdded,
}) => {
    const { user } = useAuth();
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Omit<Report, "id">>({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        tagId: 0,
        userId: user?.userId || 0,
        progress: 0,
        remainingHours: 0,
        issue: "",
        solution: "",
    });

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const fetchedTags = await tagService.getAllTags();
                setTags(fetchedTags);
                // Set default tagId to the first tag if available
                if (fetchedTags.length > 0 && formData.tagId === 0) {
                    setFormData((prev) => ({
                        ...prev,
                        tagId: fetchedTags[0].id || 0,
                    }));
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
                toast.error("Không thể lấy danh sách tag");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        // Fix: Cho phép xóa số 0 ở đầu khi nhập giá trị số
        if (name === "progress" || name === "remainingHours") {
            if (value === "") {
                setFormData((prev) => ({ ...prev, [name]: 0 }));
                return;
            }

            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setFormData((prev) => ({ ...prev, [name]: numValue }));
            }
        } else if (name === "tagId") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.date) {
            toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
            return;
        }

        if (formData.progress < 0 || formData.progress > 100) {
            toast.error("Tiến độ phải từ 0-100%");
            return;
        }

        if (formData.remainingHours < 0) {
            toast.error("Số giờ còn lại không thể âm");
            return;
        }

        setIsSubmitting(true);

        try {
            const reportData = {
                ...formData,
                userId: user?.userId || 0,
            };

            await reportService.createReport(reportData);
            toast.success("Tạo báo cáo thành công");

            // Reset form
            setFormData({
                title: "",
                content: "",
                date: new Date().toISOString().split("T")[0],
                tagId: tags.length > 0 ? tags[0].id || 0 : 0,
                userId: user?.userId || 0,
                progress: 0,
                remainingHours: 0,
                issue: "",
                solution: "",
            });

            // Notify parent component
            onReportAdded();
        } catch (error) {
            console.error("Error creating report:", error);
            toast.error("Tạo báo cáo thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="title"
                        >
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            required
                            placeholder="Nhập tiêu đề báo cáo"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="date"
                        >
                            Ngày <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="content"
                    >
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={4}
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                        required
                        placeholder="Mô tả chi tiết công việc của bạn"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="tagId"
                        >
                            Tag <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="tagId"
                            name="tagId"
                            value={formData.tagId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            required
                        >
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="progress"
                        >
                            Tiến độ (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="progress"
                            name="progress"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            required
                            placeholder="0-100"
                        />
                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${formData.progress}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="remainingHours"
                        >
                            Giờ còn lại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="remainingHours"
                            name="remainingHours"
                            min="0"
                            step="0.5"
                            value={formData.remainingHours}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            required
                            placeholder="Ví dụ: 5.5"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="issue"
                        >
                            Vấn đề gặp phải
                        </label>
                        <input
                            type="text"
                            id="issue"
                            name="issue"
                            value={formData.issue}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            placeholder="Nếu có vấn đề phát sinh"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="solution"
                        >
                            Giải pháp
                        </label>
                        <input
                            type="text"
                            id="solution"
                            name="solution"
                            value={formData.solution}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition-colors"
                            placeholder="Cách giải quyết vấn đề"
                        />
                    </div>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center ml-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            "Lưu báo cáo"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportForm;
