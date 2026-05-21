import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
        },
        {
          id: '2',
          title: 'Another Post',
          content: 'More content',
          createdAt: '2024-01-02T00:00:00.000Z',
          authorId: 'user2',
          authorName: 'Another User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', 'not valid json{{{');

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ not: 'an array' }));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('just a string'));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getPosts();
      expect(result).toEqual([]);

      spy.mockRestore();
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage under the correct key', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
        },
      ];

      savePosts(posts);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(posts);
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [
        {
          id: '1',
          title: 'Old Post',
          content: 'Old content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(initialPosts));

      const newPosts = [
        {
          id: '2',
          title: 'New Post',
          content: 'New content',
          createdAt: '2024-01-02T00:00:00.000Z',
          authorId: 'user2',
          authorName: 'User 2',
        },
      ];
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('2');
    });

    it('saves an empty array without error', () => {
      savePosts([]);

      const stored = localStorage.getItem('writespace_posts');
      expect(JSON.parse(stored)).toEqual([]);
    });

    it('gracefully handles localStorage.setItem throwing', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => savePosts([{ id: '1' }])).not.toThrow();

      spy.mockRestore();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'u2',
          displayName: 'Bob',
          username: 'bob',
          password: 'pass456',
          role: 'admin',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', '{{invalid json}}');

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify(42));

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getUsers();
      expect(result).toEqual([]);

      spy.mockRestore();
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage under the correct key', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveUsers(users);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(users);
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [
        {
          id: 'u1',
          displayName: 'Old User',
          username: 'olduser',
          password: 'old',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(initialUsers));

      const newUsers = [
        {
          id: 'u2',
          displayName: 'New User',
          username: 'newuser',
          password: 'new',
          role: 'admin',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('u2');
    });

    it('saves an empty array without error', () => {
      saveUsers([]);

      const stored = localStorage.getItem('writespace_users');
      expect(JSON.parse(stored)).toEqual([]);
    });

    it('gracefully handles localStorage.setItem throwing', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveUsers([{ id: 'u1' }])).not.toThrow();

      spy.mockRestore();
    });
  });

  describe('key isolation', () => {
    it('uses writespace_posts key for posts and writespace_users key for users independently', () => {
      const posts = [
        {
          id: 'p1',
          title: 'Post',
          content: 'Content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u1',
          authorName: 'User',
        },
      ];
      const users = [
        {
          id: 'u1',
          displayName: 'User',
          username: 'user',
          password: 'pass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      savePosts(posts);
      saveUsers(users);

      expect(getPosts()).toEqual(posts);
      expect(getUsers()).toEqual(users);

      expect(localStorage.getItem('writespace_posts')).toBe(JSON.stringify(posts));
      expect(localStorage.getItem('writespace_users')).toBe(JSON.stringify(users));
    });

    it('saving posts does not affect users and vice versa', () => {
      const posts = [{ id: 'p1', title: 'Post', content: 'C', createdAt: '', authorId: '', authorName: '' }];
      const users = [{ id: 'u1', displayName: 'U', username: 'u', password: 'p', role: 'user', createdAt: '' }];

      savePosts(posts);
      saveUsers(users);

      savePosts([]);
      expect(getUsers()).toEqual(users);

      saveUsers([]);
      expect(getPosts()).toEqual([]);
    });
  });
});