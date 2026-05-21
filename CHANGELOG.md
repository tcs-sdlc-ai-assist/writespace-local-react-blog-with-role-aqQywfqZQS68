# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page**
  - Hero section with WriteSpace branding and call-to-action links
  - Features section highlighting Write Freely, Private & Local, and Instant & Fast
  - Latest posts preview displaying up to 3 recent blog posts
  - Footer with navigation links and copyright notice
  - Public navigation bar with Login and Get Started buttons for guests
  - Authenticated users see avatar chip and Go to Dashboard link

- **Client-Side Authentication**
  - Login page with username and password form validation
  - Registration page with display name, username, password, and confirm password fields
  - Hard-coded admin account (username: `admin`, password: `admin`)
  - Session persistence via `localStorage` under `writespace_session` key
  - Automatic redirect for already-authenticated users away from login and register pages
  - Input trimming and inline error messages for validation failures

- **Role-Based Access Control**
  - `ProtectedRoute` component guarding authenticated and admin-only routes
  - Two roles supported: `admin` and `user`
  - Unauthenticated users redirected to `/login`
  - Non-admin users redirected to `/blogs` when accessing admin routes
  - Admin users have full access to all routes

- **Blog CRUD Operations**
  - Blog listing page at `/blogs` with responsive grid layout sorted newest first
  - Write new post page at `/blogs/new` with title and content fields
  - Edit post page at `/blogs/edit/:id` with pre-populated form fields
  - Read post page at `/blogs/:id` with full content display
  - Title character limit of 100 and content character limit of 2000 with live counters
  - Post ownership enforcement: users can only edit/delete their own posts
  - Admin users can edit and delete any post
  - Delete confirmation flow before removing posts
  - Empty state with call-to-action when no posts exist
  - `BlogCard` component with truncated content preview, author avatar, and date

- **Admin Dashboard**
  - Gradient header banner with personalized welcome message
  - Four stat cards showing total posts, total users, admin count, and user count
  - Quick action buttons for writing new posts and managing users
  - Recent 5 posts list with edit and delete controls
  - Navigation to full blog listing and user management pages

- **User Management**
  - Admin-only user management page at `/admin/users`
  - Create new user form with display name, username, password, confirm password, and role selection
  - Username uniqueness validation including reserved `admin` username
  - User list displaying all accounts with avatar, role badge, and creation date
  - Delete user with confirmation dialog
  - Cascade deletion of user posts when a user is removed
  - Protection against deleting the hard-coded admin account
  - Protection against self-deletion

- **localStorage Persistence**
  - Posts stored under `writespace_posts` key
  - Users stored under `writespace_users` key
  - Session stored under `writespace_session` key
  - Graceful error handling for storage read/write failures
  - Key isolation ensuring posts, users, and session data do not interfere

- **Responsive UI with Tailwind CSS**
  - Mobile-first responsive design using Tailwind utility classes
  - Authenticated navigation bar with mobile hamburger menu toggle
  - Dropdown user menu with logout functionality
  - Consistent color scheme using indigo, violet, emerald, amber, and rose palettes
  - Hover and transition effects on interactive elements
  - Role-based avatar indicators (crown for admin, book for user)

- **Vercel Deployment**
  - `vercel.json` configuration with SPA rewrite rules for client-side routing
  - Vite build output to `dist` directory

- **Testing**
  - Unit tests for `auth.js` utilities (getSession, setSession, clearSession)
  - Unit tests for `storage.js` utilities (getPosts, savePosts, getUsers, saveUsers)
  - Component tests for `Home` page with mocked storage and auth
  - Component tests for `LandingPage` with all sections verified
  - Component tests for `LoginPage` with form validation and credential checks
  - Integration tests for `App` routing covering public, protected, and admin routes
  - Test setup using Vitest with jsdom environment and React Testing Library