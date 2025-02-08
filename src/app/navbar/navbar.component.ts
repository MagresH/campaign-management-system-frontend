import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatAnchor, MatButton} from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import {AuthService} from '../services/auth.service';
import {SellerService} from '../services/seller.service';
import {AccountBalanceComponent} from '../components/account-balance/account-balance.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    MatToolbar,
    AccountBalanceComponent,
    NgIf,
    MatAnchor
  ]
})
export class NavbarComponent implements OnInit {
  sellerId: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.authService.sellerId$.subscribe((sellerId) => {
      this.sellerId = sellerId;
    });
  }

  logout(): void {
    if (this.sellerId) {
      this.sellerService.deleteSeller(this.sellerId).subscribe({
        next: () => {
          this.authService.setSellerId(null);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error logging out:', error);
          this.authService.setSellerId(null);
          this.router.navigate(['/']);
        },
      });
    } else {
      console.error('No sellerId found.');
      this.router.navigate(['/']);
    }
  }
}
