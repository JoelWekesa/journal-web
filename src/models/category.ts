export interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    _count: Count;
}

export interface Count {
    Journal: number;
}
