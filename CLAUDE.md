# Project Context

## What this is

Discovering Magic (mtg-deck-match) — a static React + TypeScript SPA that matches
people to Magic: The Gathering Commander precon decks. No backend, no database, no
serverless functions: all data is static JSON in `src/data/`.

## Workflow

Auto-deploys via GitHub.

### Deployment

- Push to `main` triggers an auto-deploy to **Cloudflare Pages**.
- The app is a static single-page app — there is nothing to provision server-side.

### Commits

- Plain, descriptive commit messages. No external ticket system.

### Branch naming (optional)

If creating branches: `david-steinbroner/short-description`
