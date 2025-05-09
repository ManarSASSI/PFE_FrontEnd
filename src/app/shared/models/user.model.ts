export interface User {
    id: number;
    username: string;
    email: string;
    phone?: string;  // Make optional if not always present
    location?: string;
    avatar?: string;
    role?: 'ADMIN' | 'PARTNER' | 'MANAGER';
    // Add other properties you need from your template
  }