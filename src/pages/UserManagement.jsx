import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers, getPosts, savePosts } from '../utils/storage';
import { Navbar } from '../components/Navbar';
import { UserRow } from '../components/UserRow';

const HARDCODED_ADMIN = {
  id: 'admin',
  displayName: 'Admin',
  username: 'admin',
  role: 'admin',
  createdAt: new Date('2024-01-01').toISOString(),
};

/**
 * Generates a UUID string for use as a unique identifier.
 * Uses crypto.randomUUID if available, otherwise falls back to a simple implementation.
 * @returns {string} A UUID string.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Admin-only user management page at '/admin/users'.
 * Create user form at top with display name, username, password, confirm password, and role fields.
 * Validates all fields and checks username uniqueness.
 * User list below showing all users with avatars, roles, and created dates via UserRow component.
 * Delete with confirmation. Hard-coded admin cannot be deleted. Self-deletion prevented.
 * @returns {JSX.Element} The user management page element.
 */
export default function UserManagement() {
  const session = getSession();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  const users = getUsers();
  const allUsers = [HARDCODED_ADMIN, ...users];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedDisplayName.length > 50) {
      setError('Display name must be 50 characters or less.');
      return;
    }

    if (trimmedUsername.length > 30) {
      setError('Username must be 30 characters or less.');
      return;
    }

    if (trimmedPassword.length > 50) {
      setError('Password must be 50 characters or less.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (trimmedUsername === 'admin') {
      setError('Username is already taken.');
      return;
    }

    const currentUsers = getUsers();
    const usernameExists = currentUsers.some((u) => u.username === trimmedUsername);

    if (usernameExists) {
      setError('Username is already taken.');
      return;
    }

    const newUser = {
      id: generateId(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...currentUsers, newUser]);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setSuccess(`User "${newUser.displayName}" created successfully.`);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDelete = (userId) => {
    if (userId === 'admin') {
      return;
    }

    if (session && session.userId === userId) {
      return;
    }

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);

    const currentPosts = getPosts();
    const updatedPosts = currentPosts.filter((p) => p.authorId !== userId);
    savePosts(updatedPosts);

    setRefreshKey((prev) => prev + 1);
  };

  const currentUsers = getUsers();
  const displayUsers = [HARDCODED_ADMIN, ...currentUsers];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create new users and manage existing accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Create New User
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 px-4 py-3">
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3">
              <p className="text-sm text-emerald-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

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
                  placeholder="Choose a username"
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
                  placeholder="Create a password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full sm:w-48 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              All Users ({displayUsers.length})
            </h2>
          </div>

          {displayUsers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {displayUsers.map((user) => (
                <UserRow key={user.id} user={user} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg bg-white border border-gray-100 shadow-sm">
              <p className="text-4xl mb-3">👥</p>
              <h2 className="text-lg font-semibold text-gray-900">
                No users found
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}