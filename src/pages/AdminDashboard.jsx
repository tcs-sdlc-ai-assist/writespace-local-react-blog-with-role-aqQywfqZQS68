import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { getAvatar } from '../components/Avatar';

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Truncates content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum character length.
 * @returns {string} The truncated text.
 */
function truncate(text, maxLength = 80) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Admin-only dashboard page at '/admin'.
 * Displays gradient header banner with welcome message, four StatCard components
 * showing total posts, total users, admin count, and user count.
 * Quick action buttons for writing new post and managing users.
 * Recent 5 posts list with edit/delete controls.
 * @returns {JSX.Element} The admin dashboard page element.
 */
export default function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();

  const [confirmingId, setConfirmingId] = useState(null);

  const allPosts = getPosts()
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentPosts = allPosts.slice(0, 5);

  const allUsers = getUsers();
  const totalPosts = allPosts.length;
  const totalUsers = allUsers.length + 1; // +1 for hard-coded admin
  const adminCount = allUsers.filter((u) => u.role === 'admin').length + 1;
  const userCount = allUsers.filter((u) => u.role === 'user').length;

  const handleDeleteClick = (postId) => {
    setConfirmingId(postId);
  };

  const handleConfirmDelete = (postId) => {
    const updatedPosts = getPosts().filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    setConfirmingId(null);
    navigate('/admin', { replace: true });
  };

  const handleCancelDelete = () => {
    setConfirmingId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Gradient Header Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {session ? session.displayName : 'Admin'} 👋
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base">
            Here&apos;s an overview of your WriteSpace platform.
          </p>
        </div>
      </div>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard value={totalPosts} label="Total Posts" icon="📝" color="indigo" />
          <StatCard value={totalUsers} label="Total Users" icon="👥" color="violet" />
          <StatCard value={adminCount} label="Admins" icon="👑" color="amber" />
          <StatCard value={userCount} label="Users" icon="📖" color="emerald" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link
            to="/blogs/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            ✍️ Write New Post
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            👥 Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getAvatar('user')}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/blogs/${post.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate block"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-400 truncate">
                        {truncate(post.content, 80)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {post.authorName}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(post.createdAt)}
                    </span>

                    <Link
                      to={`/blogs/edit/${post.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit post"
                    >
                      ✏️
                    </Link>

                    {confirmingId !== post.id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(post.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete post"
                      >
                        🗑️
                      </button>
                    )}

                    {confirmingId === post.id && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(post.id)}
                          className="inline-flex items-center rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelDelete}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg bg-white border border-gray-100 shadow-sm">
              <p className="text-4xl mb-3">📝</p>
              <h2 className="text-lg font-semibold text-gray-900">
                No posts yet
              </h2>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                Get started by creating the first blog post on the platform.
              </p>
              <Link
                to="/blogs/new"
                className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Write First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}