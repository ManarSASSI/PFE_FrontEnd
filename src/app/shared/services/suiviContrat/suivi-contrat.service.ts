import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuiviContrat } from '../../models/suivi-contrat.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuiviContratService {
  private apiUrl = 'http://localhost:8081/api/suivi-contrats';

  constructor(private http: HttpClient) { }


  ajouterSuivi(contratId: number, suivi: Partial<SuiviContrat>): Observable<any> {
    return this.http.post(`${this.apiUrl}/${contratId}`, suivi);
  }

  getHistorique(contratId: number): Observable<SuiviContrat[]> {
    return this.http.get<SuiviContrat[]>(`${this.apiUrl}/${contratId}/historique`);
  }
  
}
