export type Ressource = {
    _id: string;
    name: string;
    idCategory: string;
    idSupplier: string;
    createdAt: string;
    updatedAt: string;
};

export type RessourceCreate = Pick<
    Ressource,
    "name" | "idCategory" | "idSupplier"
>;

export type RessourceUpdate = RessourceCreate & {
    _id: string;
};

export type RessourceDelete = Pick<Ressource, "_id">;
