import api from "./api";

export interface Report {
    id?: number;
    title: string;
    content: string;
    date: string;
    tagId: number;
    userId: number;
    progress: number;
    remainingHours: number;
    issue?: string;
    solution?: string;
}

export interface PagedResponse {
    reports: Report[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

const reportService = {
    // Lấy tất cả báo cáo của người dùng
    getReports: async (userId: number): Promise<Report[]> => {
        const response = await api.get<Report[]>(`/reports?userId=${userId}`);
        return response.data;
    },

    // Lấy báo cáo theo ngày
    getReportsByDate: async (
        userId: number,
        date: string
    ): Promise<Report[]> => {
        const response = await api.get<Report[]>(
            `/reports?userId=${userId}&date=${date}`
        );
        return response.data;
    },

    // Lấy báo cáo theo tag
    getReportsByTag: async (
        userId: number,
        tagId: number
    ): Promise<Report[]> => {
        const response = await api.get<Report[]>(
            `/reports?userId=${userId}&tagId=${tagId}`
        );
        return response.data;
    },

    // Lấy báo cáo phân trang
    getReportsPaged: async (
        userId: number,
        page: number = 0,
        size: number = 5,
        date?: string,
        tagId?: number,
        sortBy: string = "date",
        sortDir: string = "desc"
    ): Promise<PagedResponse> => {
        try {
            let url = `/reports/paged?userId=${userId}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
            if (date) url += `&date=${date}`;
            if (tagId) url += `&tagId=${tagId}`;

            console.log("Calling API:", url);
            const response = await api.get<PagedResponse>(url, {
                timeout: 10000, // 10 seconds timeout
            });
            console.log("API response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error in getReportsPaged:", error);
            // Trả về dữ liệu mặc định để tránh crash ứng dụng
            return {
                reports: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
            };
        }
    },

    // Tìm kiếm báo cáo
    searchReports: async (
        userId: number,
        searchTerm: string
    ): Promise<Report[]> => {
        const response = await api.get<Report[]>(
            `/reports/search?userId=${userId}&searchTerm=${searchTerm}`
        );
        return response.data;
    },

    // Tìm kiếm báo cáo có phân trang
    searchReportsPaged: async (
        userId: number,
        searchTerm: string,
        page: number = 0,
        size: number = 5
    ): Promise<PagedResponse> => {
        const response = await api.get<PagedResponse>(
            `/reports/search/paged?userId=${userId}&searchTerm=${searchTerm}&page=${page}&size=${size}`
        );
        return response.data;
    },

    // Lấy một báo cáo theo ID
    getReportById: async (id: number): Promise<Report> => {
        const response = await api.get<Report>(`/reports/${id}`);
        return response.data;
    },

    // Đếm số báo cáo của người dùng
    countReports: async (userId: number): Promise<number> => {
        const response = await api.get<number>(
            `/reports/count?userId=${userId}`
        );
        return response.data;
    },

    // Tạo báo cáo mới
    createReport: async (report: Report): Promise<Report> => {
        const response = await api.post<Report>("/reports", report);
        return response.data;
    },

    // Xóa báo cáo
    deleteReport: async (id: number): Promise<void> => {
        await api.delete(`/reports/${id}`);
    },
};

export default reportService;
