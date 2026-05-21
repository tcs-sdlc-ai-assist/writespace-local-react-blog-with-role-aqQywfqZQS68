import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  describe('public routes', () => {
    it('renders the landing page at /', () => {
      render(<App />);
      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the login page at /login', () => {
      window.history.pushState({}, '', '/login');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your WriteSpace account')).toBeInTheDocument();
    });

    it('renders the register page at /register', () => {
      window.history.pushState({}, '', '/register');
      render(<App />);
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join WriteSpace and start writing today')).toBeInTheDocument();
    });

    it('landing page shows Get Started and Login links for guests', () => {
      render(<App />);
      const getStartedLinks = screen.getAllByText('Get Started');
      expect(getStartedLinks.length).toBeGreaterThan(0);
      const loginLinks = screen.getAllByText('Login');
      expect(loginLinks.length).toBeGreaterThan(0);
    });
  });

  describe('protected routes redirect unauthenticated users', () => {
    it('redirects /blogs to /login when not authenticated', () => {
      window.history.pushState({}, '', '/blogs');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /blogs/new to /login when not authenticated', () => {
      window.history.pushState({}, '', '/blogs/new');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /blogs/edit/some-id to /login when not authenticated', () => {
      window.history.pushState({}, '', '/blogs/edit/some-id');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /blogs/some-id to /login when not authenticated', () => {
      window.history.pushState({}, '', '/blogs/some-id');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /admin to /login when not authenticated', () => {
      window.history.pushState({}, '', '/admin');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /admin/users to /login when not authenticated', () => {
      window.history.pushState({}, '', '/admin/users');
      render(<App />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  describe('admin routes redirect non-admin users', () => {
    beforeEach(() => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));
    });

    it('redirects /admin to /blogs for non-admin users', () => {
      window.history.pushState({}, '', '/admin');
      render(<App />);
      expect(screen.queryByText('Welcome back,')).not.toBeInTheDocument();
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });

    it('redirects /admin/users to /blogs for non-admin users', () => {
      window.history.pushState({}, '', '/admin/users');
      render(<App />);
      expect(screen.queryByText('User Management')).not.toBeInTheDocument();
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });
  });

  describe('authenticated user access', () => {
    beforeEach(() => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));
    });

    it('renders /blogs page for authenticated user', () => {
      window.history.pushState({}, '', '/blogs');
      render(<App />);
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });

    it('renders /blogs/new page for authenticated user', () => {
      window.history.pushState({}, '', '/blogs/new');
      render(<App />);
      expect(screen.getByText('Write a New Post')).toBeInTheDocument();
    });

    it('renders /blogs/:id page for authenticated user with post not found', () => {
      window.history.pushState({}, '', '/blogs/nonexistent');
      render(<App />);
      expect(screen.getByText('Post Not Found')).toBeInTheDocument();
    });
  });

  describe('admin user access', () => {
    beforeEach(() => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));
    });

    it('renders /admin dashboard for admin user', () => {
      window.history.pushState({}, '', '/admin');
      render(<App />);
      expect(screen.getByText(/Welcome back, Admin/)).toBeInTheDocument();
    });

    it('renders /admin/users page for admin user', () => {
      window.history.pushState({}, '', '/admin/users');
      render(<App />);
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Create New User')).toBeInTheDocument();
    });

    it('admin can also access /blogs page', () => {
      window.history.pushState({}, '', '/blogs');
      render(<App />);
      expect(screen.getByText('All Blog Posts')).toBeInTheDocument();
    });

    it('admin can access /blogs/new page', () => {
      window.history.pushState({}, '', '/blogs/new');
      render(<App />);
      expect(screen.getByText('Write a New Post')).toBeInTheDocument();
    });
  });

  describe('navigation between pages', () => {
    it('navigates from landing page to login page', async () => {
      const user = userEvent.setup();
      render(<App />);

      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      await user.click(loginLinks[0]);

      await waitFor(() => {
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      });
    });

    it('navigates from landing page to register page', async () => {
      const user = userEvent.setup();
      render(<App />);

      const registerLinks = screen.getAllByRole('link', { name: /get started/i });
      await user.click(registerLinks[0]);

      await waitFor(() => {
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });
    });

    it('navigates from login page to register page', async () => {
      const user = userEvent.setup();
      window.history.pushState({}, '', '/login');
      render(<App />);

      const registerLink = screen.getByRole('link', { name: /register/i });
      await user.click(registerLink);

      await waitFor(() => {
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });
    });

    it('navigates from register page to login page', async () => {
      const user = userEvent.setup();
      window.history.pushState({}, '', '/register');
      render(<App />);

      const signInLink = screen.getByRole('link', { name: /sign in/i });
      await user.click(signInLink);

      await waitFor(() => {
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      });
    });

    it('authenticated user can navigate from blogs to write new post', async () => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      const user = userEvent.setup();
      window.history.pushState({}, '', '/blogs');
      render(<App />);

      const writeLink = screen.getByRole('link', { name: /write post/i });
      await user.click(writeLink);

      await waitFor(() => {
        expect(screen.getByText('Write a New Post')).toBeInTheDocument();
      });
    });

    it('admin can navigate from dashboard to user management', async () => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      const user = userEvent.setup();
      window.history.pushState({}, '', '/admin');
      render(<App />);

      const manageUsersLink = screen.getByRole('link', { name: /manage users/i });
      await user.click(manageUsersLink);

      await waitFor(() => {
        expect(screen.getByText('User Management')).toBeInTheDocument();
      });
    });
  });

  describe('login page redirects authenticated users', () => {
    it('redirects authenticated regular user away from /login to /blogs', () => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      window.history.pushState({}, '', '/login');
      render(<App />);

      expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });

    it('redirects authenticated admin away from /login to /admin', () => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      window.history.pushState({}, '', '/login');
      render(<App />);

      expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
      expect(screen.getByText(/Welcome back, Admin/)).toBeInTheDocument();
    });
  });

  describe('register page redirects authenticated users', () => {
    it('redirects authenticated regular user away from /register to /blogs', () => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      window.history.pushState({}, '', '/register');
      render(<App />);

      expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });

    it('redirects authenticated admin away from /register to /admin', () => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      window.history.pushState({}, '', '/register');
      render(<App />);

      expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
      expect(screen.getByText(/Welcome back, Admin/)).toBeInTheDocument();
    });
  });
});