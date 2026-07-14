/**
 * User - the domain customer.
 *
 * Distinct from the auth-session User class in `models/user.ts` (the
 * session/auth shape with username/password/accessToken). This is the
 * real domain user: a person who can have addresses, place orders,
 * hold a cart, accumulate rewards.
 *
 * Per the lessons-learned scope decisions, "Customer" was renamed to
 * "User" to align with the broader e-commerce schema. Keep the two
 * types separate - they have different lifecycles and different fields.
 */
import { Address } from './address';

export type MembershipTier = 'standard' | 'vip' | 'premium';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  mobile: string;
  /** Optional second contact line; per lessons, modeled as `string | null` not `undefined`. */
  phone: string | null;
  /** Default shipping/billing address; users can have more (added M4). */
  address: Address;
  membership: MembershipTier;
  rewards: number;
  /** External placeholder URL (i.pravatar.cc) so the asset-deletion trap doesn't recur. */
  avatarUrl: string;
}