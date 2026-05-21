import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import { Navbar } from '../components/Navbar';

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

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
 * Blog post creation and editing form page.
 * Handles both create (/blogs/new) and edit (/blogs/edit/:id) modes.
 * Enforces ownership: users can only edit their own posts; admin can edit any.
 * Title and content fields with required validation, inline errors, and character counter.
 * @returns {JSX.Element} The write/edit blog page element.
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      setNotFound(true);
      return;
    }

    const canEdit =
      session &&
      (session.role === 'admin' || session.userId === post.authorId);

    if (!canEdit) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(post.title);
    setContent(post.content);
  }, [id, isEditMode, navigate, session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Please fill in both title and content.');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be ${TITLE_MAX} characters or less.`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX) {
      setError(`Content must be ${CONTENT_MAX} characters or less.`);
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const postIndex = posts.findIndex((p) => p.id === id);

      if (postIndex === -1) {
        setError('Post not found.');
        return;
      }

      const existingPost = posts[postIndex];
      const canEdit =
        session &&
        (session.role === 'admin' || session.userId === existingPost.authorId);

      if (!canEdit) {
        setError('You do not have permission to edit this post.');
        return;
      }

      const updatedPost = {
        ...existingPost,
        title: trimmedTitle,
        content: trimmedContent,
      };

      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      savePosts(updatedPosts);

      navigate(`/blogs/${id}`, { replace: true });
    } else {
      const newPost = {
        id: generateId(),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName,
      };

      savePosts([...posts, newPost]);

      navigate(`/blogs/${newPost.id}`, { replace: true });
    }
  };

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/blogs/${id}`);
    } else {
      navigate('/blogs');
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h1 className="text-xl font-bold text-gray-900">Post Not Found</h1>
            <p className="mt-2 text-sm text-gray-500">
              The post you are trying to edit does not exist.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? 'Update your blog post below.'
              : 'Share your thoughts with the world.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {title.length}/{TITLE_MAX}
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              rows={12}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-y"
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {content.length}/{CONTENT_MAX}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}