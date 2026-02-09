import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (_credentials: LoginCredentials) => {
        // TODO: Call API when ready
        const mockUser: User = {
          id: 1,
          login: _credentials.login,
          nom: 'Caissier',
          prenom: 'Test',
          role: 'caissier',
        };
        set({ user: mockUser, token: 'mock-token', isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth_token');
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => {
        localStorage.setItem('auth_token', token);
        set({ token });
      },
    }),
    { name: 'adh-auth' }
  )
);
