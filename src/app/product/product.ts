/* Defines the product entity */

export interface IProduct {
    id: number;
    avatar: string;
    categoryId: number;
    productName: string;
    unitPrice: number;
    unitInStock: number;
}

export type WithCategory = {
    category: ICategory
}

export type WithCategoryName = {
    categoryName: string
}

export interface ICategory {
    id: number;
    categoryName: string;
}
