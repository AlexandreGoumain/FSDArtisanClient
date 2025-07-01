export type Supplier = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    category: SupplierCategory;
    status: SupplierStatus;
    lastOrderDate: Date;
    createdAt: string;
    updatedAt: string;
};

export type SupplierCategory = "wood" | "metal" | "plastic";

export type SupplierStatus = "active" | "waiting";

export type SupplierCreate = Pick<
    Supplier,
    "name" | "email" | "phone" | "category" | "status" | "lastOrderDate"
>;

export type SupplierUpdate = SupplierCreate & {
    _id?: string;
};

export type SupplierDelete = Pick<Supplier, "_id">;
