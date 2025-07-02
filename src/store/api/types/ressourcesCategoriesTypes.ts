export type RessourceCategory = {
    _id: string;
    label: string;
    createdAt: string;
    updatedAt: string;
};

export type RessourceCategoryCreate = {
    label: string;
};

export type RessourceCategoryUpdate = RessourceCategoryCreate & {
    _id: string;
};

export type RessourceCategoryDelete = Pick<RessourceCategory, "_id">;
