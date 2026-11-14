# Harness Studio — website & AI preview

The marketing site and friendly AI preview for Harness Studio, the development app where you
talk to your AI teammate in the browser while the work happens in the app.

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

- `/` — home page: talk to the AI, see the changes in Harness Studio
- `/docs` — plain-language guide for new users
- `/brand` — brand assets, palette and usage rules
- `/console` — friendly AI conversation preview
- `/login` — optional local preview sign-in
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions

## Notes

- The AI preview uses a local simulated conversation engine. It needs no account, key or provider
  setup, and it clearly labels responses as a preview.
- Conversations are stored in this browser's localStorage.
- The Google/Apple login is a local preview session: it does not contact Google or Apple and stores
  only a demo profile in localStorage.
- The logo, banner and favicon in `public/brand/` are SVGs based on the supplied artwork. Replace
  them with the original files if exact raster parity is required.
- `dist/` is the BrowserRouter build; a host serving it directly needs an SPA fallback so `/docs`,
  `/brand`, `/console` and `/login` resolve.
- `dist-gh-pages/` is the static GitHub Pages build. It uses HashRouter and relative assets, so no
  fallback rewrite is required.
