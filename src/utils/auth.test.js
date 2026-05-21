import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, setSession, clearSession } from './auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns parsed admin session object from localStorage', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_session', 'not valid json{{{');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains a non-object value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('just a string'));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session object is missing userId', () => {
      const session = {
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session object is missing username', () => {
      const session = {
        userId: 'user1',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session object is missing displayName', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session object has invalid role', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'superadmin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session object has non-string userId', () => {
      const session = {
        userId: 123,
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getSession();
      expect(result).toBeNull();

      spy.mockRestore();
    });

    it('returns null when localStorage contains an array', () => {
      localStorage.setItem('writespace_session', JSON.stringify([1, 2, 3]));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains a number', () => {
      localStorage.setItem('writespace_session', JSON.stringify(42));

      const result = getSession();
      expect(result).toBeNull();
    });
  });

  describe('setSession', () => {
    it('saves session object to localStorage under the correct key', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      setSession(session);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(session);
    });

    it('saves admin session object to localStorage', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };

      setSession(session);

      const stored = localStorage.getItem('writespace_session');
      expect(JSON.parse(stored)).toEqual(session);
    });

    it('overwrites existing session in localStorage', () => {
      const initialSession = {
        userId: 'user1',
        username: 'olduser',
        displayName: 'Old User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(initialSession));

      const newSession = {
        userId: 'user2',
        username: 'newuser',
        displayName: 'New User',
        role: 'admin',
      };
      setSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
    });

    it('gracefully handles localStorage.setItem throwing', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() =>
        setSession({
          userId: 'user1',
          username: 'testuser',
          displayName: 'Test User',
          role: 'user',
        })
      ).not.toThrow();

      spy.mockRestore();
    });

    it('session saved by setSession can be retrieved by getSession', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      setSession(session);

      const result = getSession();
      expect(result).toEqual(session);
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('getSession returns null after clearSession', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      setSession(session);

      expect(getSession()).toEqual(session);

      clearSession();

      expect(getSession()).toBeNull();
    });

    it('gracefully handles localStorage.removeItem throwing', () => {
      const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      expect(() => clearSession()).not.toThrow();

      spy.mockRestore();
    });

    it('does not affect other localStorage keys', () => {
      localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p1' }]));
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      setSession(session);

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
      expect(localStorage.getItem('writespace_posts')).toBe(JSON.stringify([{ id: 'p1' }]));
    });
  });

  describe('key usage', () => {
    it('uses writespace_session key for all session operations', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      setSession(session);
      expect(localStorage.getItem('writespace_session')).toBe(JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);

      clearSession();
      expect(localStorage.getItem('writespace_session')).toBeNull();
    });

    it('session operations do not interfere with posts or users storage keys', () => {
      const posts = [{ id: 'p1', title: 'Post', content: 'C', createdAt: '', authorId: '', authorName: '' }];
      const users = [{ id: 'u1', displayName: 'U', username: 'u', password: 'p', role: 'user', createdAt: '' }];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      setSession(session);

      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);

      clearSession();

      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);
    });
  });
});