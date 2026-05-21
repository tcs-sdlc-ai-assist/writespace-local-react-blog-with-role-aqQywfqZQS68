import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

import { getUsers } from '../utils/storage';
import { getSession, setSession } from '../utils/auth';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockReturnValue(null);
    getUsers.mockReturnValue([]);
    mockNavigate.mockReset();
  });

  describe('form rendering', () => {
    it('renders the Welcome Back heading', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('renders the sign in subtitle', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByText('Sign in to your WriteSpace account')).toBeInTheDocument();
    });

    it('renders the username input field', () => {
      renderWithRouter(<LoginPage />);
      const usernameInput = screen.getByLabelText('Username');
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute('type', 'text');
    });

    it('renders the password input field', () => {
      renderWithRouter(<LoginPage />);
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('renders the Sign In button', () => {
      renderWithRouter(<LoginPage />);
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();
    });

    it('renders the Register link', () => {
      renderWithRouter(<LoginPage />);
      const registerLink = screen.getByRole('link', { name: /register/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.getAttribute('href')).toBe('/register');
    });

    it('renders the username placeholder text', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    });

    it('renders the password placeholder text', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });
  });

  describe('validation errors', () => {
    it('shows error when both fields are empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('shows error when username is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'somepassword');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'someuser');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('shows error when username and password contain only spaces', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, '   ');
      await user.type(passwordInput, '   ');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('shows error for invalid credentials', async () => {
      const user = userEvent.setup();
      getUsers.mockReturnValue([]);
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('shows error when admin username is used with wrong password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'wrongpassword');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('clears error on new submission attempt', async () => {
      const user = userEvent.setup();
      getUsers.mockReturnValue([
        {
          id: 'user1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'testpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ]);
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(signInButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();

      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass');
      await user.click(signInButton);

      expect(screen.queryByText('Invalid username or password.')).not.toBeInTheDocument();
    });
  });

  describe('admin credential validation', () => {
    it('logs in with admin credentials and navigates to /admin', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('does not check localStorage users when admin credentials match', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(getUsers).not.toHaveBeenCalled();
    });
  });

  describe('user credential validation', () => {
    const mockUsers = [
      {
        id: 'user1',
        displayName: 'Alice',
        username: 'alice',
        password: 'alicepass',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'user2',
        displayName: 'Bob',
        username: 'bob',
        password: 'bobpass',
        role: 'user',
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ];

    beforeEach(() => {
      getUsers.mockReturnValue(mockUsers);
    });

    it('logs in with valid user credentials and navigates to /blogs', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'alice');
      await user.type(passwordInput, 'alicepass');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('logs in with second user credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'bob');
      await user.type(passwordInput, 'bobpass');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'user2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('shows error for valid username but wrong password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'alice');
      await user.type(passwordInput, 'wrongpassword');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
      expect(setSession).not.toHaveBeenCalled();
    });

    it('shows error for nonexistent username', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'nonexistent');
      await user.type(passwordInput, 'somepass');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
      expect(setSession).not.toHaveBeenCalled();
    });
  });

  describe('session creation on success', () => {
    it('calls setSession with correct session object for admin login', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).toHaveBeenCalledTimes(1);
      expect(setSession).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('calls setSession with correct session object for regular user login', async () => {
      const user = userEvent.setup();
      getUsers.mockReturnValue([
        {
          id: 'user99',
          displayName: 'Charlie',
          username: 'charlie',
          password: 'charliepass',
          role: 'user',
          createdAt: '2024-02-01T00:00:00.000Z',
        },
      ]);
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'charlie');
      await user.type(passwordInput, 'charliepass');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).toHaveBeenCalledTimes(1);
      expect(setSession).toHaveBeenCalledWith({
        userId: 'user99',
        username: 'charlie',
        displayName: 'Charlie',
        role: 'user',
      });
    });

    it('does not call setSession on failed login', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, 'invalid');
      await user.type(passwordInput, 'invalid');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).not.toHaveBeenCalled();
    });
  });

  describe('redirect behavior for already-authenticated users', () => {
    it('redirects authenticated regular user to /blogs', () => {
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderWithRouter(<LoginPage />);

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('redirects authenticated admin user to /admin', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(<LoginPage />);

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('does not redirect when no session exists', () => {
      getSession.mockReturnValue(null);

      renderWithRouter(<LoginPage />);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('navigation links', () => {
    it('has a link to the register page', () => {
      renderWithRouter(<LoginPage />);
      const registerLink = screen.getByRole('link', { name: /register/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.getAttribute('href')).toBe('/register');
    });

    it('renders the "Don\'t have an account?" text', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    });
  });

  describe('input interaction', () => {
    it('allows typing in the username field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'myusername');

      expect(usernameInput).toHaveValue('myusername');
    });

    it('allows typing in the password field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('trims whitespace from username and password before validation', async () => {
      const user = userEvent.setup();
      getUsers.mockReturnValue([
        {
          id: 'user1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'testpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ]);
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      await user.type(usernameInput, '  testuser  ');
      await user.type(passwordInput, '  testpass  ');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
    });
  });

  describe('public navbar', () => {
    it('renders the WriteSpace logo in the navbar', () => {
      renderWithRouter(<LoginPage />);
      const writeSpaceLinks = screen.getAllByText('WriteSpace');
      expect(writeSpaceLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});