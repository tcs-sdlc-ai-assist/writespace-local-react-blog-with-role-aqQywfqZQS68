import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

const HARDCODED_ADMIN_ID = 'admin';

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
 * User display row/card component for admin user management.
 * Renders as a table row on desktop and a stacked card on mobile.
 * Shows avatar, display name, username, role badge, created date, and delete button.
 * Handles delete confirmation and prevents deletion of hard-coded admin and self-deletion.
 * @param {object} props
 * @param {object} props.user - The user object to display.
 * @param {string} props.user.id - The unique user ID.
 * @param {string} props.user.displayName - The user's display name.
 * @param {string} props.user.username - The user's username.
 * @param {string} props.user.role - The user's role ('admin' or 'user').
 * @param {string} props.user.createdAt - ISO date string of account creation.
 * @param {function} props.onDelete - Callback invoked with the user ID when deletion is confirmed.
 * @returns {JSX.Element} A styled user row/card element.
 */
export function UserRow({ user, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const session = getSession();

  const isSelf = session && session.userId === user.id;
  const isHardcodedAdmin = user.id === HARDCODED_ADMIN_ID;
  const canDelete = !isSelf && !isHardcodedAdmin;

  const handleDeleteClick = () => {
    setConfirming(true);
  };

  const handleConfirm = () => {
    setConfirming(false);
    onDelete(user.id);
  };

  const handleCancel = () => {
    setConfirming(false);
  };

  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
        User
      </span>
    );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getAvatar(user.role)}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user.displayName}
          </p>
          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {roleBadge}
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatDate(user.createdAt)}
        </span>

        {canDelete && !confirming && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete user"
          >
            🗑️
          </button>
        )}

        {canDelete && confirming && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {!canDelete && (
          <div className="w-8 h-8 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};