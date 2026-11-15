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
- `/console` — interactive product demo
- `/get-started` — contact path for teams and individual builders
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions

## Notes

- Harness Studio is the company; Harness Copilot is its AI development app. The home page and FAQ
  make that distinction explicit where it matters.
- The interactive chat is deliberately a local, simulated demo. It needs no account or provider
  setup, and the page says clearly that changes are simulated.
- The console opens into a required Terms & Conditions and Privacy Policy agreement. Acceptance is
  stored without credentials; the old demo sign-in and browser-permission flow have been removed.
- Demo conversations are stored in this browser's localStorage.
- `/console` opens the consent screen for first-time visitors and then the Copilot workspace.
- The old `/login` route has been removed.
- The logo, banner and social card in `public/brand/`, plus the favicon in `public/`, are the official site assets.
- `dist/` is the BrowserRouter build; a host serving it directly needs an SPA fallback so `/docs`,
  `/brand`, `/console` and `/get-started` resolve.
- `dist-gh-pages/` is the static GitHub Pages build. It uses HashRouter and relative assets, so no
  fallback rewrite is required.
