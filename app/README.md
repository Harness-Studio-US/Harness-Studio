# Harness Studio — website & Harness Code console

Marketing site and developer console for Harness Studio.

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

The Pages build uses hash routing (`/#/docs`, `/#/console`, etc.) and relative asset paths, so it
works at both `username.github.io` and `username.github.io/repository` without an SPA fallback or a
custom base path.

## Routes

- `/` — marketing site
- `/docs` — Harness Code API documentation
- `/brand` — brand assets, palette and usage rules
- `/console` — chat console with model, prompt, tool, API-key and dev-tool settings
- `/login` — optional Google/Apple preview sign-in (local session, no OAuth server)
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions

## Notes

- The console ships with a local simulated chat engine. Replies stream and render without a key.
- To use a real model: Console → Settings → API keys → Connect a provider. It accepts any OpenAI-compatible base URL, key and model. Provider calls happen from the browser, so CORS can apply — use a server proxy in production.
- Settings, conversations, API keys, webhooks and request logs are stored in this browser's localStorage.
- The Google/Apple login is a local preview session: it does not contact Google or Apple and stores only a demo profile in localStorage. Real OAuth requires provider client IDs and a deployed callback URL.
- The logo, banner and favicon in `public/brand/` were rebuilt as SVGs based on the supplied artwork. Replace them with the original files if exact raster parity is required.
- `dist/` is the BrowserRouter build; a host serving it directly needs an SPA fallback so `/docs`, `/brand` and `/console` resolve.
- `dist-gh-pages/` is the static GitHub Pages build. It uses HashRouter and relative assets, so no fallback rewrite is required.
- `github-pages/index.html` remains available as the earlier one-file export, but it is not used by the Pages workflow.
