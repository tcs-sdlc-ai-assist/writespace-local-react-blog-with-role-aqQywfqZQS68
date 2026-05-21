import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';
import { PublicNavbar } from '../components/PublicNavbar';

const HARDCODED_ADMIN = {
  userId: 'admin',
  username: 'admin',
  password: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

/**
 * Login page component at '/login'.
 * Provides a form with username and password fields on a gradient background.
 * Checks hard-coded admin credentials first, then localStorage users.
 * Writes session via auth.js on success and redirects accordingly.
 * Redirects already-authenticated users away from the login page.
 * @returns {JSX.Element} The login page element.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password.');
      return;
    }

    if (
      trimmedUsername === HARDCODED_ADMIN.username &&
      trimmedPassword === HARDCODED_ADMIN.password
    ) {
      setSession({
        userId: HARDCODED_ADMIN.userId,
        username: HARDCODED_ADMIN.username,
        displayName: HARDCODED_ADMIN.displayName,
        role: HARDCODED_ADMIN.role,
      });
      navigate('/admin', { replace: true });
      return;
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    );

    if (!found) {
      setError('Invalid username or password.');
      return;
    }

    setSession({
      userId: found.id,
      username: found.username,
      displayName: found.displayName,
      role: found.role,
    });
    navigate('/blogs', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-1 text-sm text-gray-500">
                Sign in to your WriteSpace account
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 px-4 py-3">
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}