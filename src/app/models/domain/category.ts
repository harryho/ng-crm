/**
 * Category - product taxonomy.
 *
 * Per the lessons-learned doc: categories derived from brand-name frequency
 * across the actual product set (Anta: 9, Li-Ning: 6, Nike: 6, XTEP: 2,
 * Adidas: 1 in our current fixture). A category can legitimately end up with
 * zero products after a recategorization - that's fine, as long as anything
 * that lists categories handles "no products in this one" by omission.
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
}