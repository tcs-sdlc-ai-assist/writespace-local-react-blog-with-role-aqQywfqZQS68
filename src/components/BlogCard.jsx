import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

const BORDER_COLORS = [
  'border-violet-500',
  'border-indigo-500',
  'border-emerald-500',
  'border-amber-500',
  'border-rose-500',
  'border-sky-500',
];

/**
 * Truncates content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum character length.
 * @returns {string} The truncated text.
 */
function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.slice(0, maxLength).trimEnd() + '…';
}

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
 * Reusable blog post preview card component.
 * Displays title, excerpt, date, author avatar, and optional edit control.
 * @param {object} props
 * @param {object} props.post - The post object to display.
 * @param {string} props.post.id - The unique post ID.
 * @param {string} props.post.title - The post title.
 * @param {string} props.post.content - The full post content.
 * @param {string} props.post.createdAt - ISO date string of creation.
 * @param {string} props.post.authorId - The author's user ID.
 * @param {string} props.post.authorName - The author's display name.
 * @param {number} [props.index=0] - Index for cycling the top border color.
 * @returns {JSX.Element} A styled blog card element.
 */
export function BlogCard({ post, index = 0 }) {
  const session = getSession();
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div
      className={`flex flex-col rounded-lg bg-white shadow-sm border border-gray-100 border-t-4 ${borderColor} overflow-hidden transition hover:shadow-md`}
    >
      <div className="flex flex-col flex-1 p-5">
        <Link
          to={`/blogs/${post.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
        >
          {post.title}
        </Link>

        <p className="mt-2 text-sm text-gray-500 flex-1">
          {truncate(post.content, 120)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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

          {canEdit && (
            <Link
              to={`/blogs/edit/${post.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit post"
            >
              ✏️
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

BlogCard.defaultProps = {
  index: 0,
};