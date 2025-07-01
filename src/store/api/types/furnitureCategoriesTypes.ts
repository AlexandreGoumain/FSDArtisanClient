export type FurnitureCategory = {
    _id: string;
    label: string;
    createdAt: string;
    updatedAt: string;
};

export type FurnitureCategoryCreate = Pick<FurnitureCategory, "label">;

export type FurnitureCategoryUpdate = FurnitureCategoryCreate & {
    _id?: string;
};

export type FurnitureCategoryDelete = Pick<FurnitureCategory, "_id">;
