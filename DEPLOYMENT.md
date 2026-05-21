# Deployment Guide

This guide covers deploying WriteSpace to [Vercel](https://vercel.com/), including repository setup, build configuration, SPA routing, and troubleshooting.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Connecting Your Git Repository](#connecting-your-git-repository)
- [Automatic Builds](#automatic-builds)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [CI/CD via Vercel Auto-Deploy](#cicd-via-vercel-auto-deploy)
- [Manual Deployment](#manual-deployment)

---

## Prerequisites

- A [GitHub](https://github.com/), [GitLab](https://gitlab.com/), or [Bitbucket](https://bitbucket.org/) account with the WriteSpace repository pushed
- A [Vercel](https://vercel.com/) account (free tier is sufficient)
- Node.js v18 or higher installed locally (for local builds and testing)

---

## Connecting Your Git Repository

1. **Sign in to Vercel** at [https://vercel.com/](https://vercel.com/) using your Git provider account.

2. **Import the project**:
   - Click **"Add New…"** → **"Project"** from the Vercel dashboard.
   - Select the Git provider where your WriteSpace repository is hosted.
   - Authorize Vercel to access your repositories if prompted.
   - Find and select the **writespace** repository from the list.

3. **Configure the project settings**:
   - **Framework Preset**: Vercel will auto-detect **Vite**. If not, select it manually.
   - **Build Command**: `vite build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
   - **Root Directory**: Leave as `.` (the repository root)

4. **Click "Deploy"** to trigger the first build and deployment.

Once the deployment completes, Vercel will provide a production URL (e.g., `https://writespace-xxxxx.vercel.app`).

---

## Automatic Builds

Vercel automatically builds and deploys your application on every push:

| Branch        | Deployment Type | URL                                      |
| ------------- | --------------- | ---------------------------------------- |
| `main`        | Production      | Your primary production domain           |
| Other branches| Preview         | Unique preview URL per commit/branch     |

- **Production deployments** are triggered when you push to the `main` branch (or whichever branch you configure as production in Vercel project settings).
- **Preview deployments** are triggered on pushes to any other branch or on pull request creation. Each preview deployment gets a unique URL for testing before merging.

No additional configuration is needed — Vercel handles this automatically once the repository is connected.

---

## SPA Rewrite Configuration

WriteSpace is a single-page application (SPA) using React Router for client-side routing. The `vercel.json` file in the repository root ensures that all routes are served by `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### How It Works

- When a user navigates to a route like `/blogs` or `/admin/users` directly (via the browser address bar, a bookmark, or a page refresh), Vercel receives a request for that path.
- Without the rewrite rule, Vercel would return a 404 because no static file exists at `/blogs` or `/admin/users`.
- The rewrite rule tells Vercel to serve `index.html` for all routes, allowing React Router to handle the routing on the client side.

### Important Notes

- The `vercel.json` file is already included in the repository. No manual configuration is needed on the Vercel dashboard.
- Static assets in the `dist/assets/` directory (JavaScript bundles, CSS files) are served directly and are not affected by the rewrite rule because Vercel serves exact file matches before applying rewrites.

---

## Environment Variables

**WriteSpace does not require any environment variables.**

All data is stored in the browser's `localStorage`. There are no server-side APIs, databases, or third-party services to configure. The application runs entirely on the client side.

- No `.env` file is needed for deployment.
- No environment variables need to be configured in the Vercel dashboard.
- The `VITE_` prefix convention for Vite environment variables is not used in this project.

---

## Troubleshooting

### Direct URL Access Returns a Blank Page or 404

**Cause**: The `vercel.json` rewrite configuration is missing or not being applied.

**Solution**:
1. Verify that `vercel.json` exists in the repository root with the correct rewrite rule (see [SPA Rewrite Configuration](#spa-rewrite-configuration) above).
2. Ensure the file is committed and pushed to the branch being deployed.
3. Trigger a redeployment from the Vercel dashboard if needed.

### Page Loads but Shows a White Screen

**Cause**: A JavaScript error is preventing the application from rendering.

**Solution**:
1. Open the browser developer tools (F12) and check the **Console** tab for errors.
2. Verify the build completed successfully in the Vercel deployment logs.
3. Run `npm run build` locally to check for build errors before pushing.

### Build Fails on Vercel

**Cause**: Dependency installation or build step errors.

**Solution**:
1. Check the Vercel deployment logs for the specific error message.
2. Ensure `package.json` is valid and all dependencies are listed.
3. Run `npm install && npm run build` locally to reproduce the issue.
4. Verify that the Node.js version on Vercel matches your local version (v18+). You can set the Node.js version in Vercel project settings under **Settings** → **General** → **Node.js Version**.

### Assets Not Loading (CSS or JavaScript)

**Cause**: Incorrect base path or asset references.

**Solution**:
1. Ensure `vite.config.js` does not set a custom `base` path (the default `/` is correct for Vercel).
2. Clear the browser cache and reload the page.
3. Check the **Network** tab in browser developer tools for 404 errors on asset requests.

### localStorage Data Not Persisting

**Cause**: This is not a deployment issue. `localStorage` is browser-specific and per-origin.

**Solution**:
- Data stored in `localStorage` is tied to the specific browser and domain. Each user's data is independent.
- If a user clears their browser data, all WriteSpace data (posts, users, session) will be lost.
- Different Vercel preview URLs are treated as different origins, so `localStorage` data is not shared between preview and production deployments.

---

## CI/CD via Vercel Auto-Deploy

Vercel provides built-in CI/CD with zero configuration. The deployment pipeline works as follows:

1. **Push code** to your Git repository.
2. **Vercel detects the push** via the Git integration webhook.
3. **Install dependencies**: Vercel runs `npm install` automatically.
4. **Build the project**: Vercel runs `vite build` to generate the `dist` directory.
5. **Deploy**: The contents of `dist` are deployed to Vercel's global edge network.
6. **URL assignment**: Production pushes update the production URL; branch pushes get unique preview URLs.

### Running Tests Before Deployment

Vercel does not run tests by default. To ensure tests pass before deployment, you have two options:

**Option A — Use GitHub Actions (recommended)**:

Create a `.github/workflows/ci.yml` file in your repository:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run test
```

This runs tests on every push and pull request. If tests fail, the pull request will show a failing check, preventing accidental merges of broken code.

**Option B — Override the Vercel build command**:

In the Vercel dashboard under **Settings** → **General** → **Build & Development Settings**, set the build command to:

```
npm run test && vite build
```

This runs tests as part of the Vercel build step. If tests fail, the deployment will fail.

### Deployment Notifications

Vercel provides deployment status notifications through:

- **Git commit status checks**: Visible on pull requests in GitHub/GitLab/Bitbucket.
- **Vercel dashboard**: View all deployments, their status, and logs.
- **Integrations**: Optionally connect Slack or other notification services via the Vercel dashboard.

---

## Manual Deployment

If you prefer not to use Vercel's Git integration, you can deploy manually using the Vercel CLI:

1. **Install the Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Build the project locally**:

   ```bash
   npm run build
   ```

3. **Deploy**:

   ```bash
   vercel --prod
   ```

   Follow the prompts to link your project and deploy. The CLI will upload the `dist` directory and apply the `vercel.json` configuration automatically.