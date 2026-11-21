# Faizal Ahmed — Portfolio

Complete, self-contained website source. HTML, CSS, JavaScript, images, videos, logo, favicon, and résumé PDF are included. No database, API keys, paid libraries, or ChatGPT hosting connection is required to run it.

## Open locally

Install Node.js 18 or later if needed, open a terminal in this folder, then run:

```sh
npm run dev
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. No dependency installation is needed. `npm run build` validates the existing static site in `dist/`; no compilation is required.

## Files to edit

- `dist/index.html`: home page, project cards, contact links.
- `dist/resume.html`: résumé page and download link.
- `dist/cr8us.html`, `agrigence.html`, `flow.html`, `waybuddy.html`, `meetsync.html`, `addict-coin.html`: case studies (all inside `dist/`).
- `dist/site.css`: appearance, responsive layouts, hover and menu transitions.
- `dist/site.js`: menu, gallery dragging and arrows, pixel physics, video visibility, text dust, and cursor trail.
- `dist/reload-top.js`: returns a reloaded page to the top while preserving normal anchor navigation.
- `dist/assets/` and `dist/design/`: local artwork, videos, PDF, and SVGs.
- `dist/favicon.svg`, `favicon-32.png`, and `apple-touch-icon.png`: logo icons.

Some project artwork includes the original captions as part of an exported SVG. The gallery masks those captions and uses editable HTML captions underneath. Keep the cover masks when replacing artwork.

## Put it on GitHub

Create an empty repository in your own GitHub account. From this folder:

```sh
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the URL GitHub gives you. The included `.gitignore` excludes large `.fig` originals, local hosting settings, and generated archives. Your existing Figma file can stay beside the source on your PC. The website itself uses the assets in `dist/`.

## Deploy on Vercel

Import your GitHub repository into Vercel. This folder is the project root. The included `vercel.json` configures the static output:

- Framework preset: Other.
- Build command: `npm run build`.
- Output directory: `dist`.
- Environment variables: none required.

Publish the repository root, not just the README or the Figma file. Extensionless case study URLs are enabled, and existing `.html` links remain usable.

Vercel configuration reference: https://vercel.com/docs/project-configuration/vercel-json

## Add your custom domain later

In your Vercel project's **Settings → Domains**, add the domain you own, then update its DNS using the exact records Vercel provides. Add both the bare domain and `www` if you intend to use both. This handover prepares the website; it does not create a GitHub repository, publish to Vercel, purchase a domain, or change DNS.

Domain instructions: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Current behavior

The desktop gallery supports click-and-drag, floating arrows over the covers, and the controls below. Normal clicks open projects; dragging does not. Project covers use their original proportional sizing. Mobile retains native horizontal swiping. Videos play muted and loop only while visible. Text dust supports mouse movement and touch rubbing; reduced-motion preferences are respected. Reloading any page resets it to the top, including a URL that previously had an anchor.

## Media in this GitHub copy

This repository update contains code and configuration only. New images, videos, and the resume PDF are intentionally excluded. The complete local copy in your Desktop portfolio folder contains those files. Restore the media under dist/assets before running the full asset validation or deploying a complete copy of the site. Existing tracked artwork has been left unchanged.

