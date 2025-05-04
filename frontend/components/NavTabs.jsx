import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  { href: '/', label: 'Overview' },
  { href: '/forecast', label: 'Forecasts' },
  { href: '/high-risk', label: 'High-Risk Regions' },
  { href: '/historical', label: 'Historical Data' },
];

export default function NavTabs() {
  const { pathname } = useRouter();
  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <ul className="max-w-7xl mx-auto flex space-x-8 px-4">
        {tabs.map((tab) => (
          <li key={tab.href} className="py-3">
            <Link
              href={tab.href}
              className={
                pathname === tab.href
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
