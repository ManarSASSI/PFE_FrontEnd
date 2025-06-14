import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Contrat, EtatExecution } from '../../models/contrat.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'http://localhost:8081/api/contrats';

  constructor(private http: HttpClient, private authService: AuthService) { }

   getAllContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(this.apiUrl).pipe(
    tap(contrats => console.log('API Response:', contrats)),
    catchError(err => {
      console.error('API Error:', err);
      return of([]);
    })
  );
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
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
    const manager = JSON.parse(localStorage.getItem('currentUser')!);
    // Ajouter le manager ID au contrat
    const contratWithManager = {
    ...contrat,
    managerId: manager.id
  };

    return this.http.post<Contrat>(
    this.apiUrl, 
    contratWithManager, 
    { 
      headers: this.getHeaders()  
    });
  }

  getPartnerDetails(partnerId: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/users/${partnerId}`);
}

generatePdfReport(id: number): Observable<Blob> {
    return this.http.get(`http://localhost:8081/api/rapports/contrats/${id}`, {
        responseType: 'blob'
    }).pipe(
        catchError(error => {
            // Convertit les erreurs blob en erreurs lisibles
            if (error.error instanceof Blob) {
                return new Observable(observable => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const errObj = JSON.parse(reader.result as string);
                            observable.error(new Error(errObj.error));
                        } catch (e) {
                            observable.error(new Error(reader.result as string));
                        }
                    };
                    reader.readAsText(error.error);
                });
            }
            return throwError(error);
        })
    ) as Observable<Blob>;
}

  // generatePdfReport(id: number): Observable<Blob> {
  //   return this.http.get(`/api/rapports/contrats/${id}`, {
  //     responseType: 'blob'
  //   });
  // }

  updateEtatExecution(contratId: number, etat: EtatExecution): Observable<Contrat> {
    return this.http.patch<Contrat>(`${this.apiUrl}/${contratId}/etat-execution`, { etatExecution: etat });
  }

  getContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getContratsByManager(managerId: number): Observable<Contrat[]> {
  return this.http.get<Contrat[]>(`${this.apiUrl}/manager/${managerId}`, { 
    headers: this.getHeaders() 
  });
}

getContratCountByManager(managerId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count/manager/${managerId}`);
}

getMonthlyContratsCount(managerId: number): Observable<number[]> {
  return this.http.get<number[]>(`${this.apiUrl}/monthly-count/${managerId}`);
}

getContratsByPartner(partnerId: number): Observable<Contrat[]> {
  return this.http.get<Contrat[]>(`${this.apiUrl}/partner/${partnerId}`);
}

getMonthlyContratsForPartner(partnerId: number): Observable<number[]> {
  return this.http.get<number[]>(`${this.apiUrl}/monthly/partner/${partnerId}`);
}

getGlobalMonthlyContrats(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/admin/monthly`, { 
      headers: this.getHeaders() 
    });
  }

getContratCountByPartner(partnerId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count/partner/${partnerId}`);
}

getMonthlyBudgetsForManager(managerId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/manager/${managerId}/monthly-budgets`);
  }

  getMonthlyBudgetsForPartner(partnerId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/partner/${partnerId}/monthly-budgets`);
  }

}
