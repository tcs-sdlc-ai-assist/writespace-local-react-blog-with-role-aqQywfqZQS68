import React from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Navigation bar for public/guest pages.
 * Shows 'WriteSpace' logo on left.
 * For guests: 'Login' and 'Get Started' buttons on right.
 * For authenticated users: avatar chip and 'Go to Dashboard' button.
 * @returns {JSX.Element} The public navigation bar element.
 */
export function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-100">
      <Link
        to="/"
        className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        WriteSpace
      </Link>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="flex items-center gap-2">
              {getAvatar(session.role)}
              <span className="text-sm font-medium text-gray-700">
                {session.displayName}
              </span>
            </div>
            <Link
              to={session.role === 'admin' ? '/admin' : '/blogs'}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}