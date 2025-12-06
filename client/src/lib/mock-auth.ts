import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type UserRole = 'client' | 'admin_basico' | 'admin_gestor' | 'super_admin';

export interface User {
  id: string;
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  blocked: boolean;
  lastLogin?: string;
}

export interface RecoveryAttempt {
  id: string;
  userId: string;
  method: 'dni_email' | 'email' | 'dni';
  ip: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  location: string;
}

interface AuthState {
  currentUser: User | null;
  users: User[];
  recoveryAttempts: RecoveryAttempt[];
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, dni: string) => Promise<{ success: boolean; error?: string }>;
  register: (user: Omit<User, 'id' | 'active' | 'blocked' | 'role'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Recovery Logic
  initiateRecovery: (method: string, data: any) => Promise<{ success: boolean; message?: string; maskedEmail?: string }>;
  verifyOTP: (code: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<boolean>;
  
  // Admin Logic
  getRecoveryLogs: () => RecoveryAttempt[];
  unlockUser: (userId: string) => void;
}

// Mock Initial Data
const INITIAL_USERS: User[] = [
  {
    id: '1',
    fullName: 'Carlos Admin',
    dni: '12345678',
    email: 'admin@flabef.com',
    phone: '999888777',
    role: 'super_admin',
    active: true,
    blocked: false
  },
  {
    id: '2',
    fullName: 'Juan Cliente',
    dni: '87654321',
    email: 'juan@gmail.com',
    phone: '987654321',
    role: 'client',
    active: true,
    blocked: false
  }
];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: INITIAL_USERS,
      recoveryAttempts: [],
      isAuthenticated: false,

      login: async (email, dni) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = get().users.find(u => u.email === email && u.dni === dni); // Simple mock auth
        
        if (user) {
          if (user.blocked) return { success: false, error: 'Account is blocked. Contact support.' };
          set({ currentUser: user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
      },

      register: async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check uniqueness
        const exists = get().users.some(u => u.dni === userData.dni || u.email === userData.email);
        if (exists) return { success: false, error: 'User with this DNI or Email already exists' };

        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
          role: 'client',
          active: true,
          blocked: false,
          lastLogin: new Date().toISOString()
        };

        set(state => ({ 
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true
        }));

        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      initiateRecovery: async (method, data) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const users = get().users;
        let user;

        if (method === 'dni_email') {
          user = users.find(u => u.dni === data.dni && u.email === data.email);
        } else if (method === 'email') {
          user = users.find(u => u.email === data.email);
        } else if (method === 'dni') {
          user = users.find(u => u.dni === data.dni);
        }

        // Log attempt
        const log: RecoveryAttempt = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user ? user.id : 'unknown',
          method: method as any,
          ip: '192.168.1.1', // Mock IP
          status: user ? 'pending' : 'failed',
          timestamp: new Date().toISOString(),
          location: 'Lima, PE'
        };

        set(state => ({ recoveryAttempts: [log, ...state.recoveryAttempts] }));

        if (!user) return { success: false, message: 'User not found' };

        if (method === 'dni') {
          // Mask email logic
          const [name, domain] = user.email.split('@');
          const masked = `${name.substring(0, 2)}***@${domain}`;
          return { success: true, maskedEmail: masked };
        }

        return { success: true };
      },

      verifyOTP: async (code) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return code === '123456'; // Mock OTP
      },

      resetPassword: async (password) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app, update the password hash
        return true;
      },

      getRecoveryLogs: () => get().recoveryAttempts,
      
      unlockUser: (userId) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, blocked: false } : u)
        }));
      }
    }),
    {
      name: 'flabef-auth-storage',
    }
  )
);