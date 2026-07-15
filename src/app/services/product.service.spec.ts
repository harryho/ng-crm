import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Repository } from '../data/repository';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repo = TestBed.inject(Repository);
    repo.reset();
    service = TestBed.inject(ProductService);
  });

  it('list returns all seeded products', async () => {
    const products = await firstValueFrom(service.list());
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].name).toBeTruthy();
    expect(products[0].price).toBeGreaterThan(0);
  });

  it('get returns the right product by id', async () => {
    const p = await firstValueFrom(service.get(0));
    expect(p).not.toBeNull();
    expect(p!.id).toBe(0);
    expect(p!.name).toBeTruthy();
  });

  it('get returns null for an unknown id', async () => {
    const p = await firstValueFrom(service.get(9999));
    expect(p).toBeNull();
  });

  it('filter matches by name substring (case-insensitive)', async () => {
    const filtered = await firstValueFrom(service.filter('anta'));
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of filtered) {
      expect(p.name.toLowerCase()).toContain('anta');
    }
  });

  it('filter with empty/whitespace query returns the whole list', async () => {
    const all = await firstValueFrom(service.list());
    const emptyFiltered = await firstValueFrom(service.filter(''));
    const wsFiltered = await firstValueFrom(service.filter('   '));
    expect(emptyFiltered.length).toBe(all.length);
    expect(wsFiltered.length).toBe(all.length);
  });

  it('filter with no match returns an empty list', async () => {
    const filtered = await firstValueFrom(service.filter('zzz-no-such-product-zzz'));
    expect(filtered).toEqual([]);
  });

  it('save with an existing id updates that product in place', async () => {
    const before = await firstValueFrom(service.get(0));
    const updated = { ...before!, price: 99.99 };
    const saved = await firstValueFrom(service.save(updated));
    expect(saved.price).toBe(99.99);
    const after = await firstValueFrom(service.get(0));
    expect(after!.price).toBe(99.99);
  });

  it('save with id=0 creates a new product with a fresh id', async () => {
    const before = await firstValueFrom(service.list());
    const created = await firstValueFrom(
      service.save({
        id: 0,
        name: 'Brand New Shoe',
        description: 'A test product',
        brand: 'TestBrand',
        categoryId: 1,
        price: 10,
        retailPrice: 10,
        stock: 5,
        status: 'new',
        colors: [],
        imageUrl: 'https://picsum.photos/seed/test/600/400',
      }),
    );
    expect(created.id).toBeGreaterThan(0);
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length + 1);
    const fetched = await firstValueFrom(service.get(created.id));
    expect(fetched).not.toBeNull();
    expect(fetched!.name).toBe('Brand New Shoe');
  });

  it('delete removes the product', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(23));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length - 1);
    const fetched = await firstValueFrom(service.get(23));
    expect(fetched).toBeNull();
  });

  it('delete of an unknown id is a no-op', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(9999));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length);
  });
});