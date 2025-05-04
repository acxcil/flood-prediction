import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../components/api';
import { setToken } from '../utils/auth';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      // assuming your backend has POST /users/ returning token
      await api.register(email, password);
      // then auto‐login
      const token = await api.login(email, password);
      setToken(token);
      router.push('/');
    } catch {
      setErr('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      {err && <p className="text-red-500 mb-2">{err}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full p-2 bg-green-600 text-white rounded">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log In
        </a>
      </p>
    </div>
  );
}
