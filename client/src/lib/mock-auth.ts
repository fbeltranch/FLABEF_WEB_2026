import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type UserRole = 'client' | 'admin_basico' | 'admin_gestor' | 'super_admin';

export interface User {
  id: string;
  fullName: string;
  dni: string;
  documentType: 'DNI' | 'Pasaporte' | 'Cédula' | 'RUC'; // Tipo de documento
  email: string;
  recoveryEmail?: string; // Email de recuperación
  phone: string;
  password: string;
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (user: Omit<User, 'id' | 'active' | 'blocked' | 'role'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Admin management
  createAdmin: (user: Omit<User, 'id' | 'active' | 'blocked'>) => Promise<{ success: boolean; error?: string }>;
  getAdmins: () => User[];
  deleteAdmin: (userId: string) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (userId: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  updateAdmin: (userId: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  
  // Recovery Logic
  initiateRecovery: (method: 'email' | 'dni' | 'dni_email', value: any) => Promise<{ success: boolean; message?: string; maskedEmail?: string }>;
  verifyOTP: (code: string) => Promise<boolean>;
  resetPassword: (...args: any[]) => Promise<{ success: boolean; error?: string }>;
  
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
    documentType: 'DNI',
    email: 'admin@flabef.com',
    recoveryEmail: 'carlos.recover@gmail.com',
    phone: '999888777',
    password: 'admin123',
    role: 'super_admin',
    active: true,
    blocked: false
  },
  {
    id: '2',
    fullName: 'Juan Cliente',
    dni: '87654321',
    documentType: 'DNI',
    email: 'juan@gmail.com',
    phone: '987654321',
    password: 'cliente123',
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

      login: async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = get().users.find(u => u.email === email && u.password === password);
        
        if (user) {
          if (user.blocked) return { success: false, error: 'Cuenta bloqueada. Contacta soporte.' };
          set({ currentUser: user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Email o contraseña inválidos' };
      },

      // Admin management
      createAdmin: async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const current = get().currentUser;
        if (!current) return { success: false, error: 'No autorizado' };

        // Only super_admin can create other super_admins or admin_gestor.
        if (userData.role === 'super_admin' && current.role !== 'super_admin') {
          return { success: false, error: 'Solo super_admin puede crear otro super_admin' };
        }

        if (userData.role === 'admin_gestor' && current.role !== 'super_admin') {
          return { success: false, error: 'Solo super_admin puede crear admin_gestor' };
        }

        // admin_basico can be created by super_admin or admin_gestor
        if (userData.role === 'admin_basico' && !['super_admin', 'admin_gestor'].includes(current.role)) {
          return { success: false, error: 'No autorizado para crear admin_basico' };
        }

        const exists = get().users.some(u => u.dni === userData.dni || u.email === userData.email);
        if (exists) return { success: false, error: 'Usuario ya existe' };

        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
          active: true,
          blocked: false,
        };

        set(state => ({ users: [...state.users, newUser] }));
        return { success: true };
      },

      getAdmins: () => get().users.filter(u => u.role !== 'client'),

      deleteAdmin: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const current = get().currentUser;
        if (!current) return { success: false, error: 'No autorizado' };

        const target = get().users.find(u => u.id === userId);
        if (!target) return { success: false, error: 'Usuario no existe' };

        // Prevent deleting super_admin unless current is super_admin
        if (target.role === 'super_admin' && current.role !== 'super_admin') {
          return { success: false, error: 'Solo super_admin puede eliminar otro super_admin' };
        }

        set(state => ({ users: state.users.filter(u => u.id !== userId) }));
        return { success: true };
      },

      updateUserRole: async (userId, role) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const current = get().currentUser;
        if (!current) return { success: false, error: 'No autorizado' };

        const target = get().users.find(u => u.id === userId);
        if (!target) return { success: false, error: 'Usuario no existe' };

        // role change rules
        if (role === 'super_admin' && current.role !== 'super_admin') {
          return { success: false, error: 'Solo super_admin puede promover a super_admin' };
        }

        if (target.id === current.id && role !== target.role) {
          return { success: false, error: 'No puedes cambiar tu propio rol' };
        }

        set(state => ({ users: state.users.map(u => u.id === userId ? { ...u, role } : u) }));
        return { success: true };
      },

      updateAdmin: async (userId, userData) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const current = get().currentUser;
        if (!current) return { success: false, error: 'No autorizado' };

        // Solo super_admin puede editar otros admins
        if (current.role !== 'super_admin' && current.id !== userId) {
          return { success: false, error: 'Solo super_admin puede editar otros administradores' };
        }

        const target = get().users.find(u => u.id === userId);
        if (!target) return { success: false, error: 'Usuario no existe' };

        // Validar unicidad de email si cambia
        if (userData.email && userData.email !== target.email) {
          const emailExists = get().users.some(u => u.email === userData.email && u.id !== userId);
          if (emailExists) return { success: false, error: 'Email ya existe' };
        }

        // Validar unicidad de DNI si cambia
        if (userData.dni && userData.dni !== target.dni) {
          const dniExists = get().users.some(u => u.dni === userData.dni && u.id !== userId);
          if (dniExists) return { success: false, error: 'DNI ya existe' };
        }

        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, ...userData } : u),
          currentUser: current.id === userId ? { ...current, ...userData } : current
        }));
        return { success: true };
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

      initiateRecovery: async (method, value) => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        const users = get().users;
        let user;

        if (method === 'email') {
          user = users.find(u => u.email === value);
        } else if (method === 'dni') {
          user = users.find(u => u.dni === value);
        } else if (method === 'dni_email' && value && value.dni && value.email) {
          user = users.find(u => u.dni === value.dni && u.email === value.email);
        }

        // Log attempt
        const log: RecoveryAttempt = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user ? user.id : 'unknown',
          method: method === 'email' ? 'email' : (method === 'dni' ? 'dni' : 'dni_email'),
          ip: '192.168.1.1',
          status: user ? 'success' : 'failed',
          timestamp: new Date().toISOString(),
          location: 'Lima, PE'
        };

        set(state => ({ recoveryAttempts: [log, ...state.recoveryAttempts] }));

        if (!user) return { success: false, message: 'Usuario no encontrado' };

        // Mask email
        const [name, domain] = (user.email || '').split('@');
        const masked = user.recoveryEmail || (name ? `${name.substring(0, 2)}***@${domain}` : undefined);
        return { success: true, maskedEmail: masked };
      },
      verifyOTP: async (code) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        // Mock verification: accept '123456' or '000000'
        return code === '123456' || code === '000000';
      },

      resetPassword: async (...args) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (args.length === 1) {
          // Flow from Recovery page: only newPassword provided
          const newPassword = args[0];
          // In a real flow we'd verify a token; here we just accept
          return { success: true };
        }

        const [email, dni, newPassword] = args;
        const user = get().users.find(u => u.email === email && u.dni === dni);
        
        if (!user) return { success: false, error: 'Usuario no encontrado' };

        set(state => ({
          users: state.users.map(u => u.id === user.id ? { ...u, password: newPassword } : u)
        }));

        return { success: true };
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