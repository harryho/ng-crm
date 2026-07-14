/**
 * Domain barrel - re-exports all new domain types.
 *
 * Kept separate from `models/index.ts` (which only re-exports the auth-
 * session User) so importing domain types is explicit:
 *   import { User, Product, Order } from 'src/app/models/domain';
 * and importing the auth user stays as:
 *   import { User as AuthUser } from 'src/app/models';
 *
 * Per the lessons-learned: don't conflate the two.
 */
export * from './address';
export * from './cart';
export * from './carrier';
export * from './category';
export * from './order';
export * from './order-item';
export * from './order-status';
export * from './payment';
export * from './product';
export * from './shipment';
export * from './staff';
export * from './user';