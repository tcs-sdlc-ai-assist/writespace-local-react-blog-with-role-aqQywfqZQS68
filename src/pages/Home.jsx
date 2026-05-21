import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { BlogCard } from '../components/BlogCard';
import { Navbar } from '../components/Navbar';

/**
 * Authenticated blog listing page at '/blogs'.
 * Displays all posts in a responsive grid sorted newest first.
 * Shows empty state with CTA if no posts exist.
 * @returns {JSX.Element} The blog listing page element.
 */
export default function Home() {
  const session = getSession();
  const allPosts = getPosts()
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session && session.role === 'admin' ? 'All Blog Posts' : 'My Blogs'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {allPosts.length > 0
                ? `${allPosts.length} post${allPosts.length === 1 ? '' : 's'} published`
                : 'No posts yet'}
            </p>
          </div>
          <Link
            to="/blogs/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            ✍️ Write Post
          </Link>
        </div>

        {allPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg bg-white border border-gray-100 shadow-sm">
            <p className="text-4xl mb-3">📝</p>
            <h2 className="text-lg font-semibold text-gray-900">
              No posts yet
            </h2>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Start sharing your thoughts with the world. Write your first blog post today!
            </p>
            <Link
              to="/blogs/new"
              className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}