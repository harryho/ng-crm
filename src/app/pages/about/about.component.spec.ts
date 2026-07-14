import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AboutComponent } from './about.component';

describe('About', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: {
              subscribe: (fn: (value: any) => void) =>
                fn({ yourData: 'yolo' }),
            },
          },
        },
      ],
    }),
  );

  it('should create the about component', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    const about = fixture.componentInstance;
    expect(about).toBeTruthy();
    expect(about.pageTitle).toEqual('About');
  });
});