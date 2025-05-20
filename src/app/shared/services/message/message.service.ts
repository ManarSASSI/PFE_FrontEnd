import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8081/api/messages';

  constructor(private http: HttpClient) { }

   // Envoyer un message
  sendMessage(senderId: number, receiverId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, null, {
      params: {
        senderId: senderId.toString(),
        receiverId: receiverId.toString(),
        content: content
      }
    });
  }

  // Obtenir une conversation
  getConversation(user1Id: number, user2Id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversation`, {
      params: {
        user1: user1Id.toString(),
        user2: user2Id.toString()
      }
    });
  }

  // Obtenir les messages de l'utilisateur
  getUserMessages(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Marquer comme lu
  markAsRead(messageId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${messageId}/read`, {});
  }

  // Supprimer un message
  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${messageId}`);
  }

}
