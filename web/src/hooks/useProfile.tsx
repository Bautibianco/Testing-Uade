import { useEffect, useState } from 'react';
import { ApiError, ChangePasswordData, UpdateProfileData, User } from '../types';
import { api } from '../utils/api';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<{ user: User }>('/profile');
      setUser(response.data.user);
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      setError(apiError?.error || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: UpdateProfileData): Promise<User> => {
    try {
      const response = await api.put<{ user: User }>('/profile', profileData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al actualizar el perfil');
    }
  };

  const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      await api.put('/profile/password', passwordData);
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al cambiar la contraseña');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    updateProfile,
    changePassword,
    refetch: fetchProfile
  };
};
