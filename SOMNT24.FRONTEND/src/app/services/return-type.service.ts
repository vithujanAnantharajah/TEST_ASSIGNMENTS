import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from 'xont-ventura-services';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Senior Approach: Auto-registers service, better tree-shaking
})
export class ReturnTypeService {
  // Use inject() for a cleaner, modern look (Angular 14+)
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  private errorSource = new Subject<HttpErrorResponse>();
  errorOccurred$ = this.errorSource.asObservable();

  private get baseApiUrl(): string {
    return `${this.commonService.getAPIPrefix('SOMNT24')}/api/SOMNT24`;
  }

  /**
   * Centralized error handler
   */
  private handleError(error: HttpErrorResponse) {
    this.errorSource.next(error);
    console.error(`SOMNT24 API Error: ${error.message}`);
    return throwError(() => error);
  }

  // --- GET METHODS ---

  public getModulePromptData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/GetModulePromptData`)
      .pipe(catchError(err => this.handleError(err)));
  }

  public getModulePromptDataForNew(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/GetModulePromptDataForNew`)
      .pipe(catchError(err => this.handleError(err)));
  }

  public getCategoryPromptData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/GetCategoryPromptData`)
      .pipe(catchError(err => this.handleError(err)));
  }

  public getSelectedReturnType(moduleCode: string, returnType: string): Observable<any> {
    // Senior Approach: Use HttpParams instead of manual string concatenation
    const params = new HttpParams()
      .set('moduleCode', moduleCode)
      .set('returnType', returnType);

    return this.http.get<any>(`${this.baseApiUrl}/SeletedReturnType`, { params })
      .pipe(catchError(err => this.handleError(err)));
  }

  // --- POST METHODS ---

  public listReturnTypeData(criteria: any): Observable<any> {
    // HttpClient defaults to JSON headers, no need to manually append them
    return this.http.post<any>(`${this.baseApiUrl}/ListReturnTypeData`, criteria)
      .pipe(catchError(err => this.handleError(err)));
  }

  public insertReturnType(formData: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseApiUrl}/InsertReturnType`, formData)
      .pipe(catchError(err => this.handleError(err)));
  }

  public existTransaction(formData: any): Observable<string> {
    const payload = { formData };
    return this.http.post<string>(`${this.baseApiUrl}/ExistTransaction`, payload)
      .pipe(catchError(err => this.handleError(err)));
  }
}