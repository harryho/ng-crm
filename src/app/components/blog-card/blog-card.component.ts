import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';

// ecommerce card
interface productCards {
    id: number;
    imgSrc: string;
    title: string;
    price: string;
    rprice: string;
}

@Component({
    selector: 'app-blog-card',
    imports: [MatCardModule, TablerIconsModule, MatButtonModule],
    templateUrl: './blog-card.component.html',
})
export class AppBlogCardsComponent {
    constructor() { }

    productcards: productCards[] = [
        {
            id: 1,
            imgSrc: '/assets/images/products/s4.jpg',
            title: 'Boat Headphone',
            price: '285',
            rprice: '375',
        },
        {
            id: 2,
            imgSrc: '/assets/images/products/s5.jpg',
            title: 'MacBook Air Pro',
            price: '285',
            rprice: '375',
        },
        {
            id: 3,
            imgSrc: '/assets/images/products/s7.jpg',
            title: 'Red Valvet Dress',
            price: '285',
            rprice: '375',
        },
        {
            id: 4,
            imgSrc: '/assets/images/products/s11.jpg',
            title: 'Cute Soft Teddybear',
            price: '285',
            rprice: '375',
        },
    ];
}
