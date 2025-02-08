import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import {CurrencyPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.css'],
  imports: [
    CurrencyPipe,
    NgIf
  ]
})
export class AccountBalanceComponent implements OnInit, OnDestroy {
  balance: number = 0;
  sellerId: string | null = null;
  private subscription!: Subscription;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subskrybujemy zmiany sellerId
    this.subscription = this.authService.sellerId$.subscribe((sellerId) => {
      this.sellerId = sellerId;
      if (this.sellerId) {
        this.fetchBalance();
      } else {
        this.balance = 0;
      }
    });
  }

  fetchBalance(): void {
    this.accountService.getBalanceBySellerId(this.sellerId!).subscribe({
      next: (balance) => {
        this.balance = balance;
      },
      error: (error) => {
        console.error('Error fetching account balance:', error);
        this.balance = 0;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
