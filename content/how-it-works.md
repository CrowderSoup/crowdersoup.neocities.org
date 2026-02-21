# How Gardn works

Gardn keeps the workflow simple:

1. Log in at gardn.website with your own website URL.
2. Pick your first plant and harvest some URLs.
3. Grab the embed snippets from your dashboard.
4. Place those embeds into your own website.
5. Keep your design, navigation, and voice fully custom.

## The model

Gardn handles the stream logic and presentation. Your site handles branding, context, and long-form pages. You get the best of both worlds: a tended garden plus total aesthetic control.

## Two ways to embed

**Iframe embeds** drop a sandboxed block into your page. Each iframe renders the full Gardn widget, isolated from your surrounding styles. Requires `frame-src https://gardn.website` in your CSP.

**JavaScript embeds** use the `gardn.js` loader and HTML data attributes. The script fetches from Gardn's JSON API and injects styled cards directly into your DOM, so you can target them with your own CSS. Requires `connect-src https://gardn.website` in your CSP instead of `frame-src`.

## Built for IndieWeb patterns

- Works well beside Webmentions, rel="me", and hand-authored pages.
- Fits static sites and flat-file projects.
- No rewrite required if your site already exists.
