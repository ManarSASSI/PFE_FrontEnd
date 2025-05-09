import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'votre_api_url'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getProfileData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
}