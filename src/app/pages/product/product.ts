/* Defines the product entity */

export interface Product {
    id: string;
    imageUri: string;
    categoryId: number;
    name: string;
    price: number;
    retailPrice: number;
    unitInStock: number;
    colors?: string[]
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
