# Harness Studio — official website

The public website for Harness Studio, an independent software company. Our first product is
Harness Copilot, an AI development app where you describe what you want in the browser and review
the work inside your project.

The home page introduces the company, then presents Harness Copilot in its Products section. The
interactive demo sits inside that product section, so the site reads as a company site rather than a
single-product landing page.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Firebase Authentication setup

The console uses Firebase Authentication with email/password sign-in. Builds without Firebase
configuration show a setup card instead of the login form.

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Open **Authentication → Sign-in method** and enable **Email/Password**.
3. Open **Project settings → Your apps**, create a **Web** app if needed, and copy its web config.
4. Open **Authentication → Settings → Authorized domains** and add your production host
   (`harness-studio-us.github.io`) and `localhost` for local development.
5. Create `.env.local` (ignored by git) and add the values from the Firebase web config:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. Restart `bun run dev` after changing `.env.local`.
7. For GitHub Pages, add the same six names under **Settings → Secrets and variables → Actions →
   New repository secret**. The deploy workflow passes them into the Vite build.

The Firebase web API key is a public client identifier, not a server secret, but keeping it in
environment variables still keeps each environment's configuration separate. Protect the project
with Firebase Authentication provider settings and, if you later use Firestore or Storage, security
rules.

### Email verification and password reset

New accounts must confirm their email address before the workspace opens. Creating an account sends
a verification email; signing in with an unverified address shows a verification screen where the
message can be resent or the check repeated. Password reset emails open this site's own "Choose a
new password" screen rather than Firebase's default page.

Both emails return to the site root with `mode` and `oobCode` query parameters, so
`harness-studio-us.github.io` (and `localhost` for development) must stay listed under
**Authentication → Settings → Authorized domains**. If Firebase rejects that continue URL with
`auth/unauthorized-continue-uri`, the site falls back to Firebase's default email link.

### Two-step verification, phone numbers and password reset

Console settings include a **Security** tab (`/console` → Settings):

- **Two-step verification** — enroll an authenticator app (TOTP) or a phone number, and remove
  enrolled factors. The code is requested at sign-in.
- **Phone number** — verify a number with an SMS code and attach it to the account.
- **Password** — email yourself a reset link, or use the public page at `/#/reset-password`.

Multi-factor authentication is an Identity Platform feature. Before these controls work:

1. Upgrade the project to **Firebase Authentication with Identity Platform** (Blaze plan). SMS
   codes are billed per message after the first ten each day.
2. Keep **Email/Password** enabled and keep email verification on — MFA requires verified email
   addresses, and accounts without a verified address cannot enroll a second factor.
3. Open **Authentication → Sign-in method → Advanced → Multi-factor authentication** and enable
   **TOTP** and **SMS**, then allow the SMS regions you expect to serve.
4. Keep `harness-studio-us.github.io` and `localhost` in **Authorized domains**; SMS flows render a
   reCAPTCHA on those hosts.

Until the upgrade is done, enrolling a factor returns a Firebase
`auth/admin-restricted-operation` error, which the Security tab reports as "Two-step verification is
not enabled for this Firebase project yet."

### Custom email wording

The text inside the emails is edited in the Firebase Console, not in this repository:
**Authentication → Templates → Password reset** and **Email address verification**. Suggested copy:

Password reset

- Subject: `Reset your Harness Copilot password`
- Message:

```text
Hello,

We received a request to reset the password for your %APP_NAME% account (%EMAIL%).

Choose a new password here: %LINK%

If you did not ask for this, you can ignore this email and your password will stay the same.

— Harness Studio
```

Email address verification

- Subject: `Verify your email for Harness Copilot`
- Message:

```text
Welcome to %APP_NAME%.

Confirm your email address to finish setting up your workspace: %LINK%

If you did not create this account, you can ignore this email.

— Harness Studio
```

Set the template's sender name to `Harness Studio` and reply-to to `message.harness.studio@outlook.com`
so both messages match the rest of the site.

The Privacy Policy now discloses the Firebase account email and user identifier, Firebase/Google's
role as the authentication provider, local browser storage for chats, and the account-deletion
contact. Review the wording against your actual retention and deletion practices before publishing.

## Production build

```bash
bun run build       # type-check + build into dist/
bun run build:pages # multi-file GitHub Pages build into dist-gh-pages/
bun run preview     # preview the dist/ build
```

## Deploy to GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`, which builds the site and publishes
`dist-gh-pages` through GitHub Pages.

1. Push the repository to GitHub.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` or `master`, or run **Deploy GitHub Pages** from the Actions tab.

The live site is [harness-studio-us.github.io/Harness-Studio](https://harness-studio-us.github.io/Harness-Studio/).
The Pages build uses hash routing (`/#/docs`, `/#/console`, etc.) and relative asset paths, so it
works at both `username.github.io` and `username.github.io/repository` without an SPA fallback or a
custom base path.

## Routes

- `/` — company home, with Products introducing Harness Copilot
- `/docs` — plain-language guide for the product
- `/brand` — official company brand assets, palette and usage rules
- `/console` — sign-in, first-use legal agreement, settings (model, security, keys) and the interactive product demo
- `/login` — redirects to `/console`, which shows the login screen when signed out
- `/get-started` — contact path for teams and individual builders
- `/reset-password` — request a password reset link from the website
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions

## Notes

- Harness Studio is the company; Harness Copilot is its AI development app. The home page and FAQ
  make that distinction explicit where it matters.
- Firebase Authentication handles sign-in; this site never receives or stores the user's password.
- After sign-in, first-time users must accept the Terms & Conditions and Privacy Policy. Acceptance
  is stored in this browser per Firebase user ID, without credentials.
- Demo conversations are stored in this browser's localStorage, scoped to the signed-in Firebase
  user ID so separate accounts do not share chat history.
- `/console` opens the login screen. A signed-in first-time user then sees the legal agreement and
  the Copilot workspace.
- `/login` redirects to `/console` for compatibility with the previous URL.
- The logo, banner and social card in `public/brand/`, plus the favicon in `public/`, are the official site assets.
- `dist/` is the BrowserRouter build; a host serving it directly needs an SPA fallback so `/docs`,
  `/brand`, `/console` and `/get-started` resolve.
- `dist-gh-pages/` is the static GitHub Pages build. It uses HashRouter and relative assets, so no
  fallback rewrite is required.
