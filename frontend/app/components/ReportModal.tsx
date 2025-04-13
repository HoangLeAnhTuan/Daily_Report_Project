"use client";

import React, { useEffect } from "react";
import { Report } from "../services/reportService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReportModalProps {
    report: Report;
    isOpen: boolean;
    onClose: () => void;
    tagName: string;
    tagClass: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
    report,
    isOpen,
    onClose,
    tagName,
    tagClass,
}) => {
    useEffect(() => {
        console.log("ReportModal rendered, isOpen:", isOpen);
        console.log("Report data:", report);
    }, [isOpen, report]);

    if (!isOpen) {
        console.log("Modal is not open, returning null");
        return null;
    }

    console.log("Rendering modal content");

    // Format date to display in Vietnamese
    const formatDateVN = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "EEEE, dd/MM/yyyy", { locale: vi });
    };

    // Handle click outside to close
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            console.log("Overlay clicked, closing modal");
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl">
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi tiết báo cáo
                    </h2>
                    <button
                        onClick={() => {
                            console.log("Close button clicked");
                            onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {report.title}
                            </h3>
                            <span className={`tag ${tagClass} text-sm`}>
                                {tagName}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {formatDateVN(report.date)}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            Nội dung
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                            {report.content}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Tiến độ
                            </h4>
                            <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-4 mr-3 flex-grow">
                                    <div
                                        className="bg-primary h-4 rounded-full"
                                        style={{ width: `${report.progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-lg font-medium">
                                    {report.progress}%
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Giờ còn lại
                            </h4>
                            <p className="text-lg font-medium">
                                {report.remainingHours} giờ
                            </p>
                        </div>
                    </div>

                    {(report.issue || report.solution) && (
                        <div className="mb-6">
                            {report.issue && (
                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold text-red-600 mb-2">
                                        Vấn đề
                                    </h4>
                                    <div className="bg-red-50 p-4 rounded-lg text-gray-800">
                                        {report.issue}
                                    </div>
                                </div>
                            )}
                            {report.solution && (
                                <div>
                                    <h4 className="text-lg font-semibold text-green-600 mb-2">
                                        Giải pháp
                                    </h4>
                                    <div className="bg-green-50 p-4 rounded-lg text-gray-800">
                                        {report.solution}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t text-right">
                        <button
                            onClick={() => {
                                console.log("Close button (bottom) clicked");
                                onClose();
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
