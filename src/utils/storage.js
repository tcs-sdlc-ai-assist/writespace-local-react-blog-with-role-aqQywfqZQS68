const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieves all posts from localStorage.
 * @returns {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>} Array of post objects, or empty array on failure.
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves an array of posts to localStorage.
 * @param {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>} posts - The posts array to persist.
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // Gracefully handle localStorage write failure (e.g., quota exceeded)
  }
}

/**
 * Retrieves all users from localStorage.
 * @returns {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>} Array of user objects, or empty array on failure.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves an array of users to localStorage.
 * @param {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>} users - The users array to persist.
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // Gracefully handle localStorage write failure (e.g., quota exceeded)
  }
}