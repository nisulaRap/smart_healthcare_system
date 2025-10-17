import { useState } from 'react';

export default function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  function login(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return { token, login, logout };
}
