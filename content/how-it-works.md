# How it works

This is a single HTML file that reads markdown files with `fetch()`.

## The flow

1. Open `content/index.json`.
2. Add a new entry with `title`, `file`, and `slug`.
3. Save your markdown file in `/content`.
4. Refresh the page.

## Why it is simple

- There is no build step.
- There is no database.
- You control the file structure.

> If you want to keep it even simpler, remove the descriptions and let the first `#` heading be the page title.
