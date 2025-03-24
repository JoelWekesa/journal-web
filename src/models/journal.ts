export interface Journal {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    userId: string;
    category: Category;
}

export interface Category {
    name: string;
}
