import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const queryClient = new QueryClient();
const protectedRoutes = ['/subscriptions', '/admin'];

export default function MyApp({ Component, pageProps, router }) {
  const isProtected = protectedRoutes.includes(router.pathname);
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {isProtected ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </QueryClientProvider>
  );
}
