import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { BlogCard } from '../components/BlogCard';
import { PublicNavbar } from '../components/PublicNavbar';

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write Freely',
    description:
      'Express your thoughts with a clean, distraction-free writing experience. No clutter, just your words.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: '🔒',
    title: 'Private & Local',
    description:
      'Your data stays in your browser. No servers, no tracking, no accounts required to explore.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: '⚡',
    title: 'Instant & Fast',
    description:
      'Lightning-fast performance with zero loading times. Everything runs locally for the snappiest experience.',
    color: 'bg-amber-100 text-amber-600',
  },
];

/**
 * Public landing page component.
 * Displays hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element} The landing page element.
 */
export default function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = allPosts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative px-6 py-24 sm:py-32 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            WriteSpace
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            A modern, distraction-free writing space that lives entirely in your
            browser. Write, publish, and manage your blog posts — no servers
            required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 sm:py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Why WriteSpace?
          </h2>
          <p className="mt-2 text-gray-500 max-w-xl mx-auto">
            Everything you need for a seamless writing experience, right in your
            browser.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center rounded-lg bg-white p-8 shadow-sm border border-gray-100 transition hover:shadow-md"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-lg text-2xl ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="px-6 py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl mx-auto">
              See what the community has been writing about recently.
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500 text-sm">
                No posts yet. Be the first to write something!
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              WriteSpace
            </Link>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}