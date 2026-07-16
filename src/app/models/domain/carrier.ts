/**
 * Carrier - shipping company.
 *
 * Small lookup entity. Reference data lives alongside the rest of the
 * domain so the Order.shipment FK can resolve without a separate fetch.
 */
export interface Carrier {
  id: number;
  name: string;
  /** Free-text contact info, no real URL in the demo. */
  website: string;
}