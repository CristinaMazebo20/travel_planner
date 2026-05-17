import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost/travel/api';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    console.log(`GET: ${this.baseUrl}/${endpoint}`);
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    console.log(`POST: ${this.baseUrl}/${endpoint}`, data);
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    console.log(`PUT: ${this.baseUrl}/${endpoint}`, data);
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    console.log(`DELETE: ${this.baseUrl}/${endpoint}`);
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}