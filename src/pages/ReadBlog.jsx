import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import { getAvatar } from '../components/Avatar';
import { Navbar } from '../components/Navbar';

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
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Full blog post reader page at '/blogs/:id'.
 * Displays title, author avatar, author name, date, and full content.
 * Admin sees edit/delete controls on all posts.
 * Users see edit/delete only on their own posts (authorId matches session userId).
 * Delete requires confirmation and redirects to /blogs.
 * Handles invalid/missing post IDs with 'Post not found' message and back link.
 * @returns {JSX.Element} The read blog page element.
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [confirming, setConfirming] = useState(false);

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h1 className="text-xl font-bold text-gray-900">Post Not Found</h1>
            <p className="mt-2 text-sm text-gray-500">
              The post you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const handleDelete = () => {
    const updatedPosts = getPosts().filter((p) => p.id !== id);
    savePosts(updatedPosts);
    navigate('/blogs', { replace: true });
  };

  const handleDeleteClick = () => {
    setConfirming(true);
  };

  const handleCancelDelete = () => {
    setConfirming(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>

        <article className="rounded-lg bg-white p-8 shadow-sm border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            {getAvatar('user')}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {post.authorName}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {canEdit && (
            <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
              <Link
                to={`/blogs/edit/${post.id}`}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                ✏️ Edit Post
              </Link>

              {!confirming && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="inline-flex items-center rounded-md bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  🗑️ Delete
                </button>
              )}

              {confirming && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Are you sure?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}