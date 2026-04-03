import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReturnTypeService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  /**
   * Universal GET Method
   * Usage: this.service.get<User[]>('auth/users', 1, 'active')
   */
  get<T>(route: string, ...params: any[]): Observable<T> {
    const url = this.buildUrl(route, params);
    return this.http.get<T>(url).pipe(take(1));
  }

  /**
   * Universal POST Method
   * No need to manually set headers here (handled by Interceptor)
   */
  post<T>(route: string, item: any, ...params: any[]): Observable<T> {
    const url = this.buildUrl(route, params);
    return this.http.post<T>(url, item).pipe(take(1));
  }

  update<T>(route: string, item: any, id: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${route}/${id}`, item).pipe(take(1));
  }

  delete(route: string, ...params: any[]): Observable<any> {
    const url = this.buildUrl(route, params);
    return this.http.delete(url).pipe(take(1));
  }

  // Helper to join segments: api/route/param1/param2
  private buildUrl(route: string, params: any[]): string {
    const path = params.length > 0 ? `/${params.join('/')}` : '';
    return `${this.apiUrl}${route}${path}`;
  }
}