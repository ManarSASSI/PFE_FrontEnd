import { Injectable,NgZone } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Token } from '@angular/compiler';

export interface User {
  id: string;
  uid?: string; // Added to match both Firebase and Spring Boot responses
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  role: 'ADMIN' | 'MANAGER' | 'PARTNER'; // Ajouter le champ role
  permissions?: string[];
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth'; // URL de votre API Spring Boot
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser: Observable<any>;
  public showLoader = false; 

  constructor(
    private storage: StorageService,
    private http: HttpClient,
    private router: Router,public ngZone: NgZone, 
  ) {
 
    const userData = this.storage.getUser;
    this.currentUserSubject = new BehaviorSubject<any>(userData);
    this.currentUser = this.currentUserSubject.asObservable();
    this.clearStorage();  
  }

  private loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse user data', e);
        this.clearStorage();
      }
    }
  }
  private clearStorage(): void {
    localStorage.removeItem('currentUser');
  }

  public getCurrentUserValue() {
    const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
  }

  // Méthodes principales
  login(email: string, password: string): Observable<any> {
    this.showLoader = true;
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (!response?.token) {
          throw new Error('Réponse invalide du serveur');
        }
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem(' token',JSON.stringify(response.token));
        this.currentUserSubject.next(response.user);
        this.showLoader = false;
        return response.User;
      }),
      catchError(error => {
        this.showLoader = false;
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  register(userData: any): Observable<any> {

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // If using cookies/sessions
    }).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  
    
  }

  logout(): void {
    this.storage.clearAuthData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }


  resetEmail(formData: { email: string }) {
    return this.http.post(`${this.apiUrl}/forgot-password`, formData, {
    responseType: 'text'
  });
  }

  // Getters
  getisLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string {
    return localStorage.getItem('access_token') as string;
  }

  get currentUserValue(): User | null {
    const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
  }

  getCurrentUserId(): string {
    const user = this.getCurrentUserValue();
    return user?.uid || user?.id || '';
  }
  getCurrentUserRole(): string {
    const user = this.getCurrentUserValue();
    return user?.role || '';
  }

  getCurrentUserEmail(): string {
    const user = this.getCurrentUserValue();
    return user?.email || '';
  }

  getCurrentUserName(): string {
    const user = this.getCurrentUserValue();
    return user?.displayName || '';
  }

  
  SendVerificationMail(): void {
    // Implémentez cette fonction si votre backend Spring gère l'envoi d'emails
    console.warn('SendVerificationMail not implemented for Spring Boot');
  }

  resetPassword(formData: { token: string, newPassword: string }) {
  return this.http.post(`${this.apiUrl}/reset-password`, formData , {
    responseType: 'text'});
}

  SetUserData(user: any): void {
    if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  }
}
