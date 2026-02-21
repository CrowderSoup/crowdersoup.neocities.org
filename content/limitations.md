# Limitations and hosting compatibility

Gardn supports two embed methods with different CSP requirements. Iframe embeds need `frame-src https://gardn.website`. The JavaScript loader needs `connect-src https://gardn.website`.

## NeoCities

NeoCities does not expose HTTP response headers, so you cannot set CSP that way. You have two options: add a `<meta http-equiv="Content-Security-Policy">` tag in your HTML to allow iframe embeds, or use the JavaScript loader which only needs `connect-src`. This site runs on NeoCities using the meta CSP approach.

## Where Gardn works

- Static hosting where you control CSP headers or can add a meta CSP tag (Netlify, Vercel, Cloudflare Pages, GitHub Pages, NeoCities, self-hosted static).
- Custom domains where `frame-src https://gardn.website` or `connect-src https://gardn.website` is permitted.
- Personal sites that can edit HTML directly.

## What this means

If you can control security policy for your pages, either as a header or a meta tag, Gardn should slot in cleanly. If your host enforces a strict immutable CSP you cannot modify, embeds may fail.
