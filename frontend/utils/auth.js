import jwt_decode from 'jwt-decode';

// Safely access localStorage only in browser
export const setToken = (t) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', t);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUser = () => {
  const t = getToken();
  if (!t) return null;
  try {
    return jwt_decode(t);
  } catch {
    return null;
  }
};
