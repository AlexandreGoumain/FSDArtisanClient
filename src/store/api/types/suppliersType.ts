export type Supplier = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    uniqueObjectIds: string[];
    createdAt: string;
    updatedAt: string;
};

export type SupplierCreate = Pick<Supplier, "name" | "email" | "phone">;

export type SupplierUpdate = SupplierCreate & {
    _id?: string;
};

export type SupplierDelete = Pick<Supplier, "_id">;
