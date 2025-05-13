import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Contrat, EtatExecution } from '../../models/contrat.model';
import { User } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'http://localhost:8081/api/contrats';

  constructor(private http: HttpClient) { }

   getAllContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(this.apiUrl).pipe(
    tap(contrats => console.log('API Response:', contrats)),
    catchError(err => {
      console.error('API Error:', err);
      return of([]);
    })
  );
  }

  getContratById(id: number): Observable<Contrat> {
    return this.http.get<Contrat>(`${this.apiUrl}/${id}`);
  }

  getContratsByStatus(status: string): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.apiUrl}/status/${status}`);
  }

  getContratsByDepartement(departement: string): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.apiUrl}/departement/${departement}`);
  }

  getContratStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getContratCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  deleteContrat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`
    );
  }

  createContrat(contrat: Contrat): Observable<Contrat> {
    return this.http.post<Contrat>(this.apiUrl, contrat);
  }

  getPartnerDetails(partnerId: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/users/${partnerId}`);
}

  generatePdfReport(id: number): Observable<Blob> {
    return this.http.get(`/api/rapports/contrats/${id}`, {
      responseType: 'blob'
    });
  }

  updateEtatExecution(contratId: number, etat: EtatExecution): Observable<Contrat> {
    return this.http.patch<Contrat>(`${this.apiUrl}/${contratId}/etat-execution`, { etatExecution: etat });
  }

}
