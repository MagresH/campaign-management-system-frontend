import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports: [
    FormsModule
  ]
})
export class ProductFormComponent implements OnInit {
  product: Partial<Product> = {};
  sellerId: string | null = null;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('sellerId');
    if (!this.sellerId) {
      this.router.navigate(['/']);
      return;
    }

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadProduct() {
    this.productService.getProductById(this.productId!).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product:', error);
      },
    });
  }

  saveProduct() {
    if (!this.product.name || !this.product.description || !this.product.price) {
      alert('Please fill in all required fields.');
      return;
    }

    this.product.sellerId = this.sellerId!;

    if (this.isEditMode) {
      this.productService
        .updateProduct(this.productId!, this.product)
        .subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => console.error('Error updating product:', error),
        });
    } else {
      this.productService.createProductForSeller(this.sellerId!, this.product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => console.error('Error creating product:', error),
      });

    }
  }
}
