import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'access_token';

  constructor() { }

  // Récupère l'utilisateur avec gestion d'erreur
  getUser(): any {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error parsing user data', e);
      this.removeUser();
      return null;
    }
  }

  // Stocke l'utilisateur de manière sécurisée
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Récupère le token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Stocke le token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Nettoie toutes les données d'authentification
  clearAuthData(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Supprime seulement les données utilisateur
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}
