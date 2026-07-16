/**
 * StaffService - thin wrapper over Repository for Staff domain operations.
 *
 * Replaces the old EmployeeService (which didn't actually exist as a
 * service - employees were accessed through dashboard mock data). The
 * staff listing/CRUD lives here for M3.
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../data/repository';
import { Staff } from '../models/domain/staff';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly repo = inject(Repository);

  list(): Observable<Staff[]> {
    return this.repo.listStaff();
  }

  get(id: number): Observable<Staff | null> {
    return this.repo.getStaff(id);
  }

  save(member: Staff): Observable<Staff> {
    return this.repo.saveStaff(member);
  }

  delete(id: number): Observable<void> {
    return this.repo.deleteStaff(id);
  }
}