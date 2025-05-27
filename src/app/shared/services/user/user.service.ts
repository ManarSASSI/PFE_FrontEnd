import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) { }

  updateUser(id: number, userData: any): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${id}`, userData, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      })
    });
}

  getPendingUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/pending`);
  }

  getPendingCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pending/count`);
  }

  approveUser(userId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${userId}/approve`, {});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUserById(userId: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getAvatarUrl(userId: number): string {
  return `${this.apiUrl}/${userId}/avatar`;
  }
}
