/**
 * Staff - internal employees / users with admin access.
 *
 * Renamed from the old `Employee` model. Same shape as react-crm's
 * equivalent: id, name fields, role, contact info, status, and a
 * deterministic avatar URL.
 */
export type StaffRole =
  | 'Owner'
  | 'Sales Leader'
  | 'Sales'
  | 'Engineer'
  | 'Designer'
  | 'Operations'
  | 'Support'
  | 'Finance';

export type StaffStatus = 'active' | 'locked' | 'invited';

export interface Staff {
  id: number;
  firstname: string;
  lastname: string;
  company: string;
  role: StaffRole;
  email: string;
  mobile: string;
  city: string;
  state: string;
  status: StaffStatus;
  isVerified: boolean;
  /** External placeholder URL (i.pravatar.cc) so the asset-deletion trap doesn't recur. */
  avatarUrl: string;
}