import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = 'http://localhost:8081/api/alerts';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserAlerts() {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  markAsRead(alertId: number) {
    return this.http.post(`${this.apiUrl}/${alertId}/mark-as-read`, {});
  }

  deleteAlert(alertId: number) {
  return this.http.delete(`${this.apiUrl}/${alertId}`);
}

getAlertsForManager(managerId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/manager/${managerId}`);
}


}
