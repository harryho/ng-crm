/* Defines the product entity */

export interface Product {
    id: number;
    avatar: string;
    categoryId: number;
    productName: string;
    unitPrice: number;
    unitInStock: number;
}

export type WithCategory = {
    category: Category
}

export type WithCategoryName = {
    categoryName: string
}

export interface Category {
    id: number;
    categoryName: string;
}
