export interface User {
  id: number;
  username: string;
  password?: string; // Optionnel car ne doit pas être exposé inutilement
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  avatarFile?: File; // Pour les uploads
  role: Role;
  resetPasswordToken?: string;
  enabled:boolean;
}

export enum Role {
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  MANAGER = 'MANAGER'
}