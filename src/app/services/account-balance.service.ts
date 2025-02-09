import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountService} from './account.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountBalanceService {
  private balanceSubject = new BehaviorSubject<number>(0);

  balance$: Observable<number> = this.balanceSubject.asObservable();
  sellerId: string | null = null;
  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.authService.sellerId$.subscribe((sellerId) => {
      if (sellerId) {
        this.fetchBalance();
      } else {
        this.balanceSubject.next(0);
      }
    });
  }

  fetchBalance(): void {
    this.sellerId = this.authService.getSellerId();
    if (this.sellerId) {
      this.accountService.getBalanceBySellerId(this.sellerId).subscribe({
        next: (balance) => {
          this.balanceSubject.next(balance);
        },
        error: (error) => {
          console.error('Error fetching account balance:', error);
          this.balanceSubject.next(0);
        },
      });
    }
  }

  updateBalance(newBalance: number): void {
    this.balanceSubject.next(newBalance);
  }
}
