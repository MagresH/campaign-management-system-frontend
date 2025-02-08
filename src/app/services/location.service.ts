import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Location {
  id: string;
  town: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:8080/api/v1/locations';

  constructor(private http: HttpClient) {}

  getAllTowns(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/towns`);
  }
}
