import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private apiUrl = 'http://localhost:8081/api/partners';
  constructor(private http: HttpClient,private authService: AuthService) { }


  // getPartners(): Observable<User[]> {
  //   return this.http.get<User[]>(this.apiUrl).pipe(
  //     tap(data => console.log('Données reçues du backend:', data)));
  // }

  getPartners(name?: string): Observable<User[]> {
  let params = new HttpParams();
  if (name) {
    params = params.set('name', name);
  }
  return this.http.get<User[]>(`${this.apiUrl}`, { params });
}

  getPartnerCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  deletePartner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`
    );
  }

  // Nouvelle méthode pour créer un partenaire
  createPartner(partnerData: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, partnerData, {
      headers: new HttpHeaders({
      })
    });
  }

  countPartners(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  updatePartner(id: number, formData: FormData): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${id}`, formData);
  }

  getPartnerById(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getPartnersByManager(managerId: number, searchName: string = ''): Observable<User[]> {
  let params = new HttpParams();
  if (searchName) {
    params = params.set('name', searchName);
  }
  return this.http.get<User[]>(`${this.apiUrl}/manager/${managerId}`, { params });
  }

  getPartnerCountByManager(managerId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count/manager/${managerId}`);
  }

  getMonthlyPartnersCount(managerId: number): Observable<number[]> {
  return this.http.get<number[]>(`${this.apiUrl}/monthly-count/${managerId}`);
 }

 
  
}
