import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  sellerId: string;
  balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/v1/accounts';

  constructor(private http: HttpClient) {}

  getBalanceBySellerId(sellerId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${sellerId}/balance`);
  }

  createAccount(sellerId: string, initialBalance: number): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/${sellerId}`, null, {
      params: { initialBalance: initialBalance.toString() },
    });
  }

}
