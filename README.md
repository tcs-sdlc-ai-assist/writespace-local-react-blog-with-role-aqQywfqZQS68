# WriteSpace

A modern, distraction-free writing space that lives entirely in your browser. Write, publish, and manage your blog posts — no servers required.

## Tech Stack

- **React 18** — UI library
- **React Router DOM 6** — Client-side routing
- **Vite 5** — Build tool and dev server
- **Tailwind CSS 3** — Utility-first CSS framework
- **Vitest** — Unit and component testing
- **React Testing Library** — Component test utilities
- **PropTypes** — Runtime prop validation
- **localStorage** — Client-side data persistence

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (included with Node.js)

### Installation

```bash
npm install
```

### Development

Start the local development server on port 3000:

```bash
npm run dev
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).

### Build

Create a production build in the `dist` directory:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── public/
│   └── vite.svg                # Favicon
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Root component with routing
│   ├── App.test.jsx            # App routing integration tests
│   ├── index.css               # Tailwind CSS imports
│   ├── setupTests.js           # Test setup
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── BlogCard.jsx        # Blog post preview card
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard component
│   │   ├── PublicNavbar.jsx     # Public navigation bar
│   │   ├── StatCard.jsx        # Dashboard stat tile
│   │   └── UserRow.jsx         # User management row/card
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   ├── Home.jsx            # Blog listing page
│   │   ├── Home.test.jsx       # Home page tests
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LandingPage.test.jsx# Landing page tests
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── LoginPage.test.jsx  # Login page tests
│   │   ├── ReadBlog.jsx        # Blog post reader page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Blog post create/edit page
│   └── utils/
│       ├── auth.js             # Session management utilities
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.js          # localStorage persistence utilities
│       └── storage.test.js     # Storage utility tests
```

## Features

### Public Landing Page

- Hero section with WriteSpace branding and call-to-action links
- Features section highlighting Write Freely, Private & Local, and Instant & Fast
- Latest posts preview displaying up to 3 recent blog posts
- Footer with navigation links and copyright notice
- Public navigation bar with Login and Get Started buttons for guests
- Authenticated users see avatar chip and Go to Dashboard link

### Client-Side Authentication

- Login page with username and password form validation
- Registration page with display name, username, password, and confirm password fields
- Hard-coded admin account (username: `admin`, password: `admin`)
- Session persistence via `localStorage` under `writespace_session` key
- Automatic redirect for already-authenticated users away from login and register pages
- Input trimming and inline error messages for validation failures

### Role-Based Access Control

- `ProtectedRoute` component guarding authenticated and admin-only routes
- Two roles supported: `admin` and `user`
- Unauthenticated users redirected to `/login`
- Non-admin users redirected to `/blogs` when accessing admin routes
- Admin users have full access to all routes

### Blog CRUD Operations

- Blog listing page with responsive grid layout sorted newest first
- Write new post page with title and content fields
- Edit post page with pre-populated form fields
- Read post page with full content display
- Title character limit of 100 and content character limit of 2000 with live counters
- Post ownership enforcement: users can only edit/delete their own posts
- Admin users can edit and delete any post
- Delete confirmation flow before removing posts
- Empty state with call-to-action when no posts exist

### Admin Dashboard

- Gradient header banner with personalized welcome message
- Four stat cards showing total posts, total users, admin count, and user count
- Quick action buttons for writing new posts and managing users
- Recent 5 posts list with edit and delete controls
- Navigation to full blog listing and user management pages

### User Management

- Admin-only user management page
- Create new user form with display name, username, password, confirm password, and role selection
- Username uniqueness validation including reserved `admin` username
- User list displaying all accounts with avatar, role badge, and creation date
- Delete user with confirmation dialog
- Cascade deletion of user posts when a user is removed
- Protection against deleting the hard-coded admin account
- Protection against self-deletion

### Responsive UI

- Mobile-first responsive design using Tailwind utility classes
- Authenticated navigation bar with mobile hamburger menu toggle
- Dropdown user menu with logout functionality
- Consistent color scheme using indigo, violet, emerald, amber, and rose palettes
- Hover and transition effects on interactive elements
- Role-based avatar indicators (crown for admin, book for user)

## Route Map

| Path               | Access         | Description                     |
| ------------------- | -------------- | ------------------------------- |
| `/`                 | Public         | Landing page                    |
| `/login`            | Public         | Login page                      |
| `/register`         | Public         | Registration page               |
| `/blogs`            | Authenticated  | Blog listing page               |
| `/blogs/new`        | Authenticated  | Write new blog post             |
| `/blogs/edit/:id`   | Authenticated  | Edit existing blog post         |
| `/blogs/:id`        | Authenticated  | Read full blog post             |
| `/admin`            | Admin only     | Admin dashboard                 |
| `/admin/users`      | Admin only     | User management                 |

## Data Storage

All data is persisted in the browser's `localStorage` under the following keys:

| Key                   | Description                        |
| --------------------- | ---------------------------------- |
| `writespace_posts`    | Array of blog post objects         |
| `writespace_users`    | Array of user account objects      |
| `writespace_session`  | Current authenticated session      |

## Deployment

### Vercel

The project includes a `vercel.json` configuration with SPA rewrite rules for client-side routing. To deploy:

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/)
3. Vercel will auto-detect the Vite framework and configure the build
4. The build command is `vite build` and the output directory is `dist`

### Manual Deployment

1. Run `npm run build` to generate the `dist` directory
2. Deploy the contents of `dist` to any static hosting provider
3. Configure the hosting provider to redirect all routes to `index.html` for SPA support

## License

Private — All rights reserved.