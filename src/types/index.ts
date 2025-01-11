export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  mood: 'Happy' | 'Neutral' | 'Sad';
  createdAt: string;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}