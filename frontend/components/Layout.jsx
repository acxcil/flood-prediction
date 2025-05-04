import { useState, useEffect } from 'react';
import Header from './Header';
import NavTabs from './NavTabs';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header theme={theme} setTheme={setTheme} />
      <NavTabs />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
