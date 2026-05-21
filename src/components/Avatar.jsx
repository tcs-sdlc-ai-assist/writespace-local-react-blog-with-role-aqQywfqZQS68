import React from 'react';

/**
 * Returns a styled avatar JSX element based on the user's role.
 * @param {'admin'|'user'} role - The role of the user.
 * @returns {JSX.Element} A styled span element with an emoji and role-based colors.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-violet-700 text-sm font-semibold">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 text-sm font-semibold">
      📖
    </span>
  );
}