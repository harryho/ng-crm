/**
 * Product - the catalogue item.
 *
 * Replaces the flat product.ts model. Renamed `imageUri` -> `imageUrl`
 * for a more standard field name; added `categoryId` foreign key and
 * `brand` (denormalized for display convenience; per the lessons,
 * keep denormalized fields in sync - a future check will verify FK vs
 * brand copy after every seed change).
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  categoryId: number;
  price: number;
  retailPrice: number;
  stock: number;
  status: ProductStatus;
  colors: string[];
  imageUrl: string;
}

export type ProductStatus = 'new' | 'sale' | 'standard' | 'out-of-stock';