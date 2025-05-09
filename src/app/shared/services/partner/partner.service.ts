import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  getPartners(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(data => console.log('Données reçues du backend:', data)));
  }

  getPartnerCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  deletePartner(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }

  // Nouvelle méthode pour créer un partenaire
  createPartner(partnerData: FormData): Observable<User> {
    return this.http.post<User>(this.apiUrl, partnerData);
  }
  
  
  
  
}
