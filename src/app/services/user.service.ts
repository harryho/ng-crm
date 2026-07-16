/**
 * UserService - thin wrapper over Repository for User domain operations.
 *
 * Replaces the old CustomerService (which talked to HttpClient + a mock
 * backend). Per the lessons-learned doc's final verdict, no HttpClient
 * is involved - this service is a pure pass-through to Repository.
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../data/repository';
import { User } from '../models/domain/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly repo = inject(Repository);

  list(): Observable<User[]> {
    return this.repo.listUsers();
  }

  get(id: number): Observable<User | null> {
    return this.repo.getUser(id);
  }

  save(user: User): Observable<User> {
    return this.repo.saveUser(user);
  }

  delete(id: number): Observable<void> {
    return this.repo.deleteUser(id);
  }

  /**
   * Filtered list, replaces the old `fetchDataWithFilter({ params })` shape.
   * Empty / whitespace query returns the whole list.
   */
  filter(query: string): Observable<User[]> {
    const q = (query ?? '').trim().toLowerCase();
    return new Observable<User[]>((subscriber) => {
      const sub = this.repo.listUsers().subscribe((users) => {
        const filtered = q
          ? users.filter((u) => {
              const full = `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase();
              return full.includes(q);
            })
          : users;
        subscriber.next(filtered);
        subscriber.complete();
      });
      return () => sub.unsubscribe();
    });
  }
}