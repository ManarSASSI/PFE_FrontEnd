import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) { }

  updateUser(id: Number, formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, formData);
  }
}
