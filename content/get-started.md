# Get started in minutes

You can treat Gardn as progressive enhancement for your existing site.

## Quick setup

1. Log in at gardn.website using your own website URL.
2. Pick your first plant and harvest some URLs.
3. Copy the embed snippets from your dashboard.
4. Add them where you want in your layout.
5. Update your CSP: use `frame-src https://gardn.website` for iframe embeds, or `connect-src https://gardn.website` for the JavaScript loader.

## Using the JavaScript loader

Instead of iframes, you can load `gardn.js` and use data attributes to embed widgets inline:

```html
<script src="https://gardn.website/gardn.js"></script>

<!-- Single plant -->
<div data-gardn="your-username"></div>

<!-- Blog roll -->
<div data-gardn-roll="your-username"></div>

<!-- Harvests -->
<div data-gardn-harvests="your-username"></div>
```

The loader fetches from the JSON API and injects styled cards into your page. No iframe required, and no `frame-src` CSP directive needed.

## Design direction

Gardn looks best when the surrounding site has personality. Lean into handcrafted type, tactile color, and visible structure. That is the whole point: your garden should feel like *your* garden.
