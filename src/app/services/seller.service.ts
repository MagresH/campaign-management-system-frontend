import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seller {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private apiUrl = 'http://localhost:8080/api/v1/sellers';

  constructor(private http: HttpClient) {}

  createSeller(seller: Partial<Seller>): Observable<Seller> {
    return this.http.post<Seller>(this.apiUrl, seller);
  }

  updateSeller(id: string, seller: Partial<Seller>): Observable<Seller> {
    return this.http.put<Seller>(`${this.apiUrl}/${id}`, seller);
  }

  getSellerById(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/${id}`);
  }

  deleteSeller(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
