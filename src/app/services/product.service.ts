/**
 * ProductService - thin wrapper over Repository for Product domain operations.
 *
 * Replaces the old ProductService (which talked to HttpClient + a mock
 * backend). Per the lessons-learned doc's final verdict, no HttpClient
 * is involved - this service is a pure pass-through to Repository.
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../data/repository';
import { Product } from '../models/domain/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly repo = inject(Repository);

  list(): Observable<Product[]> {
    return this.repo.listProducts();
  }

  get(id: number): Observable<Product | null> {
    return this.repo.getProduct(id);
  }

  save(product: Product): Observable<Product> {
    return this.repo.saveProduct(product);
  }

  delete(id: number): Observable<void> {
    return this.repo.deleteProduct(id);
  }

  /**
   * Filtered list, replaces the old `fetchDataWithFilter({ params })` shape.
   */
  filter(query: string): Observable<Product[]> {
    return this.repo.listProductsFiltered(query);
  }
}