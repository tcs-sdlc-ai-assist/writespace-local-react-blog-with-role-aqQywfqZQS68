import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Navigation bar for authenticated pages.
 * Shows 'WriteSpace' logo, role-based nav links, avatar chip with display name,
 * and logout dropdown. Mobile hamburger toggle using React useState.
 * Calls clearSession on logout.
 * @returns {JSX.Element} The authenticated navigation bar element.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const session = getSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const isAdmin = session && session.role === 'admin';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to={isAdmin ? '/admin' : '/blogs'}
              className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              WriteSpace
            </Link>

            <div className="hidden md:flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/blogs"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                My Blogs
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Users
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session && (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  {getAvatar(session.role)}
                  <span className="text-sm font-medium text-gray-700">
                    {session.displayName}
                  </span>
                  <span className="text-xs text-gray-400">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-40 rounded-md bg-white shadow-lg border border-gray-100 py-1 z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleMobile}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMobile}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-2 py-2 rounded-md hover:bg-gray-50"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/blogs"
              onClick={closeMobile}
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-2 py-2 rounded-md hover:bg-gray-50"
            >
              My Blogs
            </Link>
            {isAdmin && (
              <Link
                to="/admin/users"
                onClick={closeMobile}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-2 py-2 rounded-md hover:bg-gray-50"
              >
                Users
              </Link>
            )}

            {session && (
              <div className="flex items-center gap-2 px-2 py-2 border-t border-gray-100 mt-2 pt-4">
                {getAvatar(session.role)}
                <span className="text-sm font-medium text-gray-700">
                  {session.displayName}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="text-left text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors px-2 py-2 rounded-md hover:bg-rose-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}