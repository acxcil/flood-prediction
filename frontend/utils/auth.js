// utils/auth.js
export const setToken = (t) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', t)
  }
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}
