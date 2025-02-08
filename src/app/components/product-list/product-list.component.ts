import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [
    CurrencyPipe,
    RouterLink,
    NgForOf
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  sellerId: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('sellerId');
    if (this.sellerId) {
      this.fetchProducts();
    } else {
      this.router.navigate(['/']);
    }
  }

  fetchProducts() {
    this.productService.getProductsBySellerId(this.sellerId!).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  createCampaign(productId: string) {
    this.router.navigate(['/campaigns/new', productId]);
  }
}

