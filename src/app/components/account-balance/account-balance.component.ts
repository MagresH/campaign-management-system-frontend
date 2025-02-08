import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
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
export class AccountBalanceComponent implements OnInit {
  balance: number = 0;
  sellerId: string | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('sellerId');
    if (this.sellerId) {
      this.fetchBalance();
    }
  }

  fetchBalance() {
    this.accountService.getBalanceBySellerId(this.sellerId!).subscribe({
      next: (balance) => {
        this.balance = balance;
      },
      error: (error) => {
        console.error('Error fetching account balance:', error);
      },
    });
  }
}
