export type Ressource = {
    _id: string;
    name: string;
    idCategory: string;
    idSupplier: string;
    description: string;
    createdAt: string;
    updatedAt: string;
};

export type RessourceCreate = Pick<
    Ressource,
    "name" | "idCategory" | "idSupplier" | "description"
>;

export type RessourceUpdate = RessourceCreate & {
    _id: string;
};

export type RessourceDelete = Pick<Ressource, "_id">;
