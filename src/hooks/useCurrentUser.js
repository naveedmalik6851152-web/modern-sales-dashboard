import { usersApi } from '@/services/api';
import { useAsync } from './useAsync';

export const useCurrentUser = () => useAsync(() => usersApi.getCurrentUser(), []);
