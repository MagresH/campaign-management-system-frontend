import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sellerIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('sellerId'));

  sellerId$ = this.sellerIdSubject.asObservable();

  setSellerId(sellerId: string | null): void {
    if (sellerId) {
      localStorage.setItem('sellerId', sellerId);
    } else {
      localStorage.removeItem('sellerId');
    }
    this.sellerIdSubject.next(sellerId);
  }

  getSellerId(): string | null {
    return this.sellerIdSubject.value;
  }
}
