const SESSION_KEY = 'writespace_session';

/**
 * Retrieves the current session from localStorage.
 * @returns {{userId: string, username: string, displayName: string, role: 'admin'|'user'}|null} The session object, or null if no session exists or on failure.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data === null) {
      return null;
    }
    const parsed = JSON.parse(data);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.userId === 'string' &&
      typeof parsed.username === 'string' &&
      typeof parsed.displayName === 'string' &&
      (parsed.role === 'admin' || parsed.role === 'user')
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves a session object to localStorage.
 * @param {{userId: string, username: string, displayName: string, role: 'admin'|'user'}} session - The session object to persist.
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Gracefully handle localStorage write failure (e.g., quota exceeded)
  }
}

/**
 * Clears the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Gracefully handle localStorage removal failure
  }
}