import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

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

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPosts.mockReturnValue([]);
    getSession.mockReturnValue(null);
  });

  describe('hero section', () => {
    it('renders the WriteSpace heading in the hero section', () => {
      renderWithRouter(<LandingPage />);
      const headings = screen.getAllByText('WriteSpace');
      expect(headings.length).toBeGreaterThanOrEqual(1);
      const heroHeading = headings.find((el) => el.tagName === 'H1');
      expect(heroHeading).toBeInTheDocument();
    });

    it('renders the hero description text', () => {
      renderWithRouter(<LandingPage />);
      expect(
        screen.getByText(/A modern, distraction-free writing space/)
      ).toBeInTheDocument();
    });

    it('renders Get Started CTA link in the hero section', () => {
      renderWithRouter(<LandingPage />);
      const getStartedLinks = screen.getAllByRole('link', { name: /get started/i });
      expect(getStartedLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Login CTA link in the hero section', () => {
      renderWithRouter(<LandingPage />);
      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('Get Started hero link points to /register', () => {
      renderWithRouter(<LandingPage />);
      const heroGetStarted = screen.getAllByRole('link', { name: /get started/i });
      const registerLink = heroGetStarted.find((link) => link.getAttribute('href') === '/register');
      expect(registerLink).toBeTruthy();
    });

    it('Login hero link points to /login', () => {
      renderWithRouter(<LandingPage />);
      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      const loginLink = loginLinks.find((link) => link.getAttribute('href') === '/login');
      expect(loginLink).toBeTruthy();
    });
  });

  describe('features section', () => {
    it('renders the Why WriteSpace? heading', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the Write Freely feature card', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Write Freely')).toBeInTheDocument();
      expect(
        screen.getByText(/Express your thoughts with a clean/)
      ).toBeInTheDocument();
    });

    it('renders the Private & Local feature card', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Private & Local')).toBeInTheDocument();
      expect(
        screen.getByText(/Your data stays in your browser/)
      ).toBeInTheDocument();
    });

    it('renders the Instant & Fast feature card', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Instant & Fast')).toBeInTheDocument();
      expect(
        screen.getByText(/Lightning-fast performance/)
      ).toBeInTheDocument();
    });

    it('renders all three feature cards', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Write Freely')).toBeInTheDocument();
      expect(screen.getByText('Private & Local')).toBeInTheDocument();
      expect(screen.getByText('Instant & Fast')).toBeInTheDocument();
    });
  });

  describe('latest posts section with no posts', () => {
    it('renders the Latest Posts heading', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    });

    it('renders empty state message when no posts exist', () => {
      renderWithRouter(<LandingPage />);
      expect(
        screen.getByText('No posts yet. Be the first to write something!')
      ).toBeInTheDocument();
    });

    it('renders Start Writing CTA when no posts exist', () => {
      renderWithRouter(<LandingPage />);
      const startWritingLink = screen.getByRole('link', { name: /start writing/i });
      expect(startWritingLink).toBeInTheDocument();
      expect(startWritingLink.getAttribute('href')).toBe('/register');
    });
  });

  describe('latest posts section with posts', () => {
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
        authorId: 'user3',
        authorName: 'Charlie',
      },
    ];

    beforeEach(() => {
      getPosts.mockReturnValue(mockPosts);
    });

    it('renders post titles when posts exist', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
    });

    it('does not render empty state message when posts exist', () => {
      renderWithRouter(<LandingPage />);
      expect(
        screen.queryByText('No posts yet. Be the first to write something!')
      ).not.toBeInTheDocument();
    });

    it('renders author names for posts', () => {
      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('limits displayed posts to 3', () => {
      const fourPosts = [
        ...mockPosts,
        {
          id: 'post4',
          title: 'Fourth Blog Post',
          content: 'Fourth content.',
          createdAt: '2024-03-04T00:00:00.000Z',
          authorId: 'user4',
          authorName: 'Diana',
        },
      ];
      getPosts.mockReturnValue(fourPosts);

      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Fourth Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.queryByText('First Blog Post')).not.toBeInTheDocument();
    });

    it('displays posts sorted by newest first', () => {
      renderWithRouter(<LandingPage />);
      const postLinks = screen.getAllByRole('link').filter((link) =>
        ['/blogs/post1', '/blogs/post2', '/blogs/post3'].includes(link.getAttribute('href'))
      );
      expect(postLinks.length).toBe(3);
      expect(postLinks[0].textContent).toBe('Third Blog Post');
      expect(postLinks[1].textContent).toBe('Second Blog Post');
      expect(postLinks[2].textContent).toBe('First Blog Post');
    });
  });

  describe('footer', () => {
    it('renders the WriteSpace logo in the footer', () => {
      renderWithRouter(<LandingPage />);
      const writeSpaceLinks = screen.getAllByRole('link', { name: /writespace/i });
      const footerLink = writeSpaceLinks.find((link) => link.getAttribute('href') === '/');
      expect(footerLink).toBeTruthy();
    });

    it('renders Login link in the footer', () => {
      renderWithRouter(<LandingPage />);
      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      const footerLogin = loginLinks.find((link) => link.getAttribute('href') === '/login');
      expect(footerLogin).toBeTruthy();
    });

    it('renders Register link in the footer', () => {
      renderWithRouter(<LandingPage />);
      const registerLink = screen.getByRole('link', { name: /register/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.getAttribute('href')).toBe('/register');
    });

    it('renders copyright text with current year', () => {
      renderWithRouter(<LandingPage />);
      const currentYear = new Date().getFullYear().toString();
      expect(
        screen.getByText(new RegExp(`© ${currentYear} WriteSpace`))
      ).toBeInTheDocument();
    });
  });

  describe('navigation bar for guests', () => {
    it('renders the public navbar with Login and Get Started for guests', () => {
      renderWithRouter(<LandingPage />);
      const navLoginLinks = screen.getAllByRole('link', { name: /login/i });
      expect(navLoginLinks.length).toBeGreaterThanOrEqual(1);
      const navGetStartedLinks = screen.getAllByRole('link', { name: /get started/i });
      expect(navGetStartedLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('navigation bar for authenticated users', () => {
    it('renders Go to Dashboard link for authenticated user', () => {
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderWithRouter(<LandingPage />);
      const dashboardLink = screen.getByRole('link', { name: /go to dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink.getAttribute('href')).toBe('/blogs');
    });

    it('renders Go to Dashboard link pointing to /admin for admin user', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(<LandingPage />);
      const dashboardLink = screen.getByRole('link', { name: /go to dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink.getAttribute('href')).toBe('/admin');
    });

    it('displays the user display name for authenticated user', () => {
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderWithRouter(<LandingPage />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});