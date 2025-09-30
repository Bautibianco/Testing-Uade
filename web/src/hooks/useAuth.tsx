import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthResponse, ApiError } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verificar si hay una cookie de autenticación
      const response = await fetch('/health', { credentials: 'include' });
      if (response.ok) {
        // Si el servidor responde, asumimos que hay una sesión válida
        // En una implementación real, podrías hacer una llamada a /auth/me
        setUser({ _id: 'temp', email: 'usuario@ejemplo.com' });
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password
      });

      if (response.data) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al iniciar sesión');
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password
      });

      if (response.data) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al registrarse');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
