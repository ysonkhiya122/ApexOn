import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

export type UseAuthReturn = ReturnType<typeof useAuth>;
