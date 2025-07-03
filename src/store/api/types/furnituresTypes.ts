export type FurnitureRessource = {
    idRessource: string;
    quantity: number;
    _id: string;
};

export type Furniture = {
    _id: string;
    name: string;
    description?: string;
    quantity: number;
    idCategory: string;
    ressources: FurnitureRessource[];
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type FurnitureStatus = "waiting" | "in_production" | "ready_to_sell";

export type FurnitureCreate = {
    name: string;
    description?: string;
    idCategory: string;
    ressources: Partial<FurnitureRessource>[];
    quantity: number;
    status: FurnitureStatus;
};

export type FurnitureUpdate = FurnitureCreate & {
    _id?: string;
};

export type FurnitureDelete = Pick<Furniture, "_id">;
