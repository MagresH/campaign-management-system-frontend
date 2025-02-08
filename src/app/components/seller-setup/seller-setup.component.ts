import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService, Seller } from '../../services/seller.service';
import { AccountService } from '../../services/account.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-seller-setup',
  templateUrl: './seller-setup.component.html',
  styleUrls: ['./seller-setup.component.css'],
  imports: [
    FormsModule
  ]
})
export class SellerSetupComponent {
  sellerName: string = '';
  initialBalance: number = 1000;
  loading: boolean = false;

  constructor(
    private sellerService: SellerService,
    private accountService: AccountService,
    private router: Router
  ) {}

  createSellerAndAccount() {
    if (!this.sellerName) {
      alert('Please enter a seller name.');
      return;
    }

    this.loading = true;

    this.sellerService
      .createSeller({ name: this.sellerName })
      .subscribe({
        next: (seller) => {
          this.accountService
            .createAccount(seller.id, this.initialBalance)
            .subscribe({
              next: () => {
                localStorage.setItem('sellerId', seller.id);
                this.router.navigate(['/products']);
              },
              error: (error) => {
                console.error('Error creating account:', error);
                this.loading = false;
              },
            });
        },
        error: (error) => {
          console.error('Error creating seller:', error);
          this.loading = false;
        },
      });
  }
}
