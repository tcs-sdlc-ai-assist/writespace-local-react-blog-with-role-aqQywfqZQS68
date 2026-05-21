import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

vi.mock('../utils/storage', () => ({
  getPosts: vi.fn(() => []),
  savePosts: vi.fn(),
  getUsers: vi.fn(() => []),
  saveUsers: vi.fn(),
}));

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(() => null),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPosts.mockReturnValue([]);
    getSession.mockReturnValue({
      userId: 'user1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    });
  });

  describe('page rendering', () => {
    it('renders the My Blogs heading for regular user', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });

    it('renders the All Blog Posts heading for admin user', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(<Home />);
      expect(screen.getByText('All Blog Posts')).toBeInTheDocument();
    });

    it('renders the Write Post link', () => {
      renderWithRouter(<Home />);
      const writeLink = screen.getByRole('link', { name: /write post/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink.getAttribute('href')).toBe('/blogs/new');
    });
  });

  describe('empty state', () => {
    it('renders empty state message when no posts exist', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders empty state description text', () => {
      renderWithRouter(<Home />);
      expect(
        screen.getByText('Start sharing your thoughts with the world. Write your first blog post today!')
      ).toBeInTheDocument();
    });

    it('renders Write Your First Post CTA when no posts exist', () => {
      renderWithRouter(<Home />);
      const ctaLink = screen.getByRole('link', { name: /write your first post/i });
      expect(ctaLink).toBeInTheDocument();
      expect(ctaLink.getAttribute('href')).toBe('/blogs/new');
    });

    it('displays "No posts yet" in the subtitle when no posts exist', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('displays post count as 0 posts in subtitle', () => {
      renderWithRouter(<Home />);
      const subtitle = screen.getByText('No posts yet');
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('blog grid rendering with posts', () => {
    const mockPosts = [
      {
        id: 'post1',
        title: 'First Blog Post',
        content: 'This is the content of the first blog post.',
        createdAt: '2024-03-01T00:00:00.000Z',
        authorId: 'user1',
        authorName: 'Alice',
      },
      {
        id: 'post2',
        title: 'Second Blog Post',
        content: 'This is the content of the second blog post.',
        createdAt: '2024-03-02T00:00:00.000Z',
        authorId: 'user2',
        authorName: 'Bob',
      },
      {
        id: 'post3',
        title: 'Third Blog Post',
        content: 'This is the content of the third blog post.',
        createdAt: '2024-03-03T00:00:00.000Z',
        authorId: 'user1',
        authorName: 'Alice',
      },
    ];

    beforeEach(() => {
      getPosts.mockReturnValue(mockPosts);
    });

    it('renders all post titles when posts exist', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
    });

    it('does not render empty state when posts exist', () => {
      renderWithRouter(<Home />);
      expect(
        screen.queryByText('Start sharing your thoughts with the world. Write your first blog post today!')
      ).not.toBeInTheDocument();
    });

    it('renders author names for posts', () => {
      renderWithRouter(<Home />);
      const aliceElements = screen.getAllByText('Alice');
      expect(aliceElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('displays correct post count in subtitle', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('3 posts published')).toBeInTheDocument();
    });

    it('displays singular post count for one post', () => {
      getPosts.mockReturnValue([mockPosts[0]]);
      renderWithRouter(<Home />);
      expect(screen.getByText('1 post published')).toBeInTheDocument();
    });

    it('renders post links pointing to correct URLs', () => {
      renderWithRouter(<Home />);
      const postLinks = screen.getAllByRole('link').filter((link) =>
        ['/blogs/post1', '/blogs/post2', '/blogs/post3'].includes(link.getAttribute('href'))
      );
      expect(postLinks.length).toBe(3);
    });
  });

  describe('post sorting (newest first)', () => {
    const mockPosts = [
      {
        id: 'post1',
        title: 'Oldest Post',
        content: 'Oldest content.',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user1',
        authorName: 'Alice',
      },
      {
        id: 'post2',
        title: 'Middle Post',
        content: 'Middle content.',
        createdAt: '2024-02-01T00:00:00.000Z',
        authorId: 'user2',
        authorName: 'Bob',
      },
      {
        id: 'post3',
        title: 'Newest Post',
        content: 'Newest content.',
        createdAt: '2024-03-01T00:00:00.000Z',
        authorId: 'user1',
        authorName: 'Alice',
      },
    ];

    it('displays posts sorted by newest first', () => {
      getPosts.mockReturnValue(mockPosts);
      renderWithRouter(<Home />);

      const postLinks = screen.getAllByRole('link').filter((link) =>
        ['/blogs/post1', '/blogs/post2', '/blogs/post3'].includes(link.getAttribute('href'))
      );
      expect(postLinks.length).toBe(3);
      expect(postLinks[0].textContent).toBe('Newest Post');
      expect(postLinks[1].textContent).toBe('Middle Post');
      expect(postLinks[2].textContent).toBe('Oldest Post');
    });
  });

  describe('edit icon visibility based on role and ownership', () => {
    const mockPosts = [
      {
        id: 'post1',
        title: 'My Own Post',
        content: 'Content of my own post.',
        createdAt: '2024-03-01T00:00:00.000Z',
        authorId: 'user1',
        authorName: 'Test User',
      },
      {
        id: 'post2',
        title: 'Someone Else Post',
        content: 'Content of someone else post.',
        createdAt: '2024-03-02T00:00:00.000Z',
        authorId: 'user2',
        authorName: 'Other User',
      },
    ];

    it('shows edit icon on own posts for regular user', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderWithRouter(<Home />);

      const editLinks = screen.getAllByRole('link').filter(
        (link) => link.getAttribute('href') && link.getAttribute('href').startsWith('/blogs/edit/')
      );
      expect(editLinks.length).toBe(1);
      expect(editLinks[0].getAttribute('href')).toBe('/blogs/edit/post1');
    });

    it('does not show edit icon on other users posts for regular user', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderWithRouter(<Home />);

      const editLinks = screen.getAllByRole('link').filter(
        (link) => link.getAttribute('href') === '/blogs/edit/post2'
      );
      expect(editLinks.length).toBe(0);
    });

    it('shows edit icon on all posts for admin user', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(<Home />);

      const editLinks = screen.getAllByRole('link').filter(
        (link) => link.getAttribute('href') && link.getAttribute('href').startsWith('/blogs/edit/')
      );
      expect(editLinks.length).toBe(2);
      const editHrefs = editLinks.map((link) => link.getAttribute('href'));
      expect(editHrefs).toContain('/blogs/edit/post1');
      expect(editHrefs).toContain('/blogs/edit/post2');
    });

    it('shows no edit icons when user owns no posts', () => {
      getPosts.mockReturnValue([
        {
          id: 'post1',
          title: 'Not My Post',
          content: 'Content.',
          createdAt: '2024-03-01T00:00:00.000Z',
          authorId: 'user99',
          authorName: 'Other User',
        },
      ]);
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderWithRouter(<Home />);

      const editLinks = screen.queryAllByRole('link').filter(
        (link) => link.getAttribute('href') && link.getAttribute('href').startsWith('/blogs/edit/')
      );
      expect(editLinks.length).toBe(0);
    });
  });

  describe('navbar rendering', () => {
    it('renders the WriteSpace logo in the navbar', () => {
      renderWithRouter(<Home />);
      const writeSpaceLinks = screen.getAllByText('WriteSpace');
      expect(writeSpaceLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the My Blogs nav link', () => {
      renderWithRouter(<Home />);
      const blogLinks = screen.getAllByRole('link', { name: /my blogs/i });
      expect(blogLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});