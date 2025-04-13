import api from "./api";

export interface Tag {
    id?: number;
    name: string;
}

const tagService = {
    // Lấy tất cả tag
    getAllTags: async (): Promise<Tag[]> => {
        const response = await api.get<Tag[]>("/tags");
        return response.data;
    },

    // Lấy tag theo ID
    getTagById: async (id: number): Promise<Tag> => {
        const response = await api.get<Tag>(`/tags/${id}`);
        return response.data;
    },

    // Tạo tag mới (cho admin)
    createTag: async (tag: Tag): Promise<Tag> => {
        const response = await api.post<Tag>("/tags", tag);
        return response.data;
    },
};

export default tagService;
