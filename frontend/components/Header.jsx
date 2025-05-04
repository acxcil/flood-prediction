import Link from 'next/link';
import { useRouter } from 'next/router';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { getToken, setToken } from '../utils/auth';

export default function Header({ theme, setTheme }) {
  const router = useRouter();
  const token = getToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          Flood Alerts
        </Link>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
          {theme === 'light' ? (
            <MoonIcon
              onClick={() => setTheme('dark')}
              className="w-6 h-6 cursor-pointer"
            />
          ) : (
            <SunIcon
              onClick={() => setTheme('light')}
              className="w-6 h-6 cursor-pointer"
            />
          )}
        </div>
      </div>
    </header>
  );
}
