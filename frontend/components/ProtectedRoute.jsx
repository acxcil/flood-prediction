import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
}
