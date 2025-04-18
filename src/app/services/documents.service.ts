import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { DocumentPayload } from '../models/documents.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private readonly apiUrl = environment.documents;

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado. El usuario debe iniciar sesión.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.apiUrl, { headers });
  }

  deleteDocument(documentId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado. El usuario debe iniciar sesión.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/${documentId}`;
    return this.http.patch(url, {}, { headers });
  }

  uploadDocument(payload: DocumentPayload): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/upload`, payload, { headers }).pipe(
      catchError(this.handleError<any>('uploadDocument'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        console.error(`Backend returned code ${error.status}, body was:`, error.error);
      }
      return of(result as T);
    };
  }
}
