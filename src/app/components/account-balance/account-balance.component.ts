import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountBalanceService} from '../../services/account-balance.service';
import {Subscription} from 'rxjs';
import {CurrencyPipe, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.css'],
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf
  ]
})
export class AccountBalanceComponent implements OnInit, OnDestroy {
  balance: number = 0;
  private subscription!: Subscription;
  private sellerSubscription!: Subscription;
  sellerId: String | null = null;

  constructor(
    private authService: AuthService,
    private accountBalanceService: AccountBalanceService
  ) {}

  ngOnInit(): void {
    this.subscription = this.accountBalanceService.balance$.subscribe((balance) => {
      this.balance = balance;
    });
    this.sellerSubscription = this.authService.sellerId$.subscribe((sellerId) => {
      if (sellerId) {
        this.sellerId = sellerId;
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
