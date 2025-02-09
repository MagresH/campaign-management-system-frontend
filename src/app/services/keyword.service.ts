import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeywordService {
  private apiUrl = 'http://195.179.228.112:8080/api/v1/keywords';

  constructor(private http: HttpClient) {}

  getKeywordsByQuery(query: string): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, {
      params: { query },
    });
  }

  findOrCreateByValues(values: string[]): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/batch`, values);
  }
}
