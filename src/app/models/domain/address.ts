/**
 * Address - structured postal address.
 *
 * Replaces the embedded city/state/country strings on the old Customer model.
 * Used by User (as homeAddress / billingAddress) and Order (as shippingAddress).
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}