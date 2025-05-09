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


  // authState: any;
  // afAuth: any;
  // afs: any;
  // public showLoader:boolean=false;

  constructor(
    private storage: StorageService,
    private http: HttpClient,
    // private afu: AngularFireAuth, 
    private router: Router,public ngZone: NgZone, 
    // private cookieService: CookieService
  ) {
 
    const userData = this.storage.getUser;
    this.currentUserSubject = new BehaviorSubject<any>(userData);
    // this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
      // this.loadUserFromStorage();
    this.clearStorage();  

    // this.afu.authState.subscribe((auth: any) => {
    //   this.authState = auth;
    // });
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


  // private loadUserFromStorage(): void {
  //   const userData = localStorage.getItem('currentUser');
  //   if (userData) {
  //     this.currentUserSubject.next(JSON.parse(userData));
  //   }
  // }

  public getCurrentUserValue() {
    return this.currentUserSubject.value;
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
  
    // return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    this.storage.clearAuthData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Getters
  getisLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string {
    return localStorage.getItem('access_token') as string;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
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

  // getIsUserEmailLoggedIn(): boolean {
  //   return this.isLoggedIn;
  // }

  // Méthodes optionnelles (si vous en avez besoin)
  SendVerificationMail(): void {
    // Implémentez cette fonction si votre backend Spring gère l'envoi d'emails
    console.warn('SendVerificationMail not implemented for Spring Boot');
  }


 

  SetUserData(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }









  // all firebase getdata functions

  // get isUserAnonymousLoggedIn(): boolean {
  //   return this.authState !== null ? this.authState.isAnonymous : false;
  // }

  // get currentUserId(): string {
  //   return this.authState !== null ? this.authState.uid : '';
  // }

  // get currentUserName(): string {
  //   return this.authState['email'];
  // }

  // get currentUser(): any {
  //   return this.authState !== null ? this.authState : null;
  // }

  // get isUserEmailLoggedIn(): boolean {
  //   if (this.authState !== null && !this.isUserAnonymousLoggedIn) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // registerWithEmail(email: string, password: string) {
  //   return this.afu
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((user: any) => {
  //       this.authState = user;
  //     })
  //     .catch((_error: any) => {
  //       console.log(_error);
  //       throw _error;
  //     });
  // }

  // loginWithEmail(email: string, password: string) {
  //   return this.afu
  //     .signInWithEmailAndPassword(email, password)
  //     .then((user: any) => {
  //       this.authState = user;
  //     })
  //     .catch((_error: any) => {
  //       console.log(_error);
  //       throw _error;
  //     });
  // }

  // singout(): void {
  //   this.afu.signOut();
  //   this.router.navigate(['/login']);
  // }


  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(this.cookieService.get('user')|| '{}');
  //   return (user != null && user.emailVerified != false) ? true : false;
  // }

    // // Sign up with email/password
    // SignUp(email:any, password:any) {
    //   return this.afAuth.createUserWithEmailAndPassword(email, password)
    //     .then((result:any) => {
    //       /* Call the SendVerificaitonMail() function when new user sign
    //       up and returns promise */
    //       this.SendVerificationMail();
    //       this.SetUserData(result.user);
    //     }).catch((error:any) => {
    //       window.alert(error.message)
    //     })
    // }


    // // main verification function
    // SendVerificationMail() {
    //   return this.afAuth.currentUser.then((u:any) => u.sendEmailVerification()).then(() => {
    //       this.router.navigate(['/dashboard/hrmdashboards/dashboard']);
    //     })
    // }
//       // Set user
//   SetUserData(user:any) {
//     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
//     const userData: User = {
//       email: user.email,
//       displayName: user.displayName,
//       uid: user.uid,
//       photoURL: user.photoURL || 'src/favicon.ico',
//       emailVerified: user.emailVerified
//     };
//     userRef.delete().then(function () {})
//           .catch(function (error:any) {});
//     return userRef.set(userData, {
//       merge: true
//     });
//   }
//  // sign in function
//  SignIn(email:any, password:any) {
//   return this.afAuth.signInWithEmailAndPassword(email, password)
//     .then((result:any) => {
//       if (result.user.emailVerified !== true) {
//         this.SetUserData(result.user);
//         this.SendVerificationMail();
//         this.showLoader = true;
//       } else {
//         this.showLoader = false;
//         this.ngZone.run(() => {
//           this.router.navigate(['/auth/login']);
//         });
//       }
//     }).catch((error:any) => {
//       throw error;
//     })
// }
// ForgotPassword(passwordResetEmail:any) {
//   return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
//     .then(() => {
//       window.alert('Password reset email sent, check your inbox.');
//     }).catch((error:any) => {
//       window.alert(error);
//     });
// }
}
