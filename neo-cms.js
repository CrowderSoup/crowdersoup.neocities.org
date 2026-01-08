const manifestPath = "content/index.json";
const nav = document.getElementById("nav");
const content = document.getElementById("content");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");
const pageStatus = document.getElementById("page-status");
const siteTitle = document.getElementById("site-title");
const siteTagline = document.getElementById("site-tagline");
const siteFooter = document.getElementById("site-footer");

let manifest = null;

const escapeHtml = (input) =>
  input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const parseMarkdown = (raw) => {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let buffer = [];
  let inCode = false;

  const flushParagraph = () => {
    if (!buffer.length) return;
    const paragraph = buffer.join(" ").trim();
    if (paragraph) {
      blocks.push(`<p>${inlineMarkdown(paragraph)}</p>`);
    }
    buffer = [];
  };

  const inlineMarkdown = (text) => {
    let html = escapeHtml(text);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
    return html;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`);
        buffer = [];
        inCode = false;
        codeLang = "";
      } else {
        flushParagraph();
        inCode = true;
        buffer = [];
      }
      continue;
    }

    if (inCode) {
      buffer.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      flushParagraph();
      const level = line.match(/^#+/)[0].length;
      blocks.push(
        `<h${level}>${inlineMarkdown(line.replace(/^#{1,3}\s/, ""))}</h${level}>`,
      );
      continue;
    }

    if (/^>\s/.test(line)) {
      flushParagraph();
      blocks.push(
        `<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ""))}</blockquote>`,
      );
      continue;
    }

    if (/^(-|\*|\+)\s+/.test(line)) {
      flushParagraph();
      const items = [line];
      while (i + 1 < lines.length && /^(-|\*|\+)\s+/.test(lines[i + 1])) {
        items.push(lines[i + 1]);
        i += 1;
      }
      const htmlItems = items
        .map(
          (item) =>
            `<li>${inlineMarkdown(item.replace(/^(-|\*|\+)\s+/, ""))}</li>`,
        )
        .join("");
      blocks.push(`<ul>${htmlItems}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const items = [line];
      while (i + 1 < lines.length && /^\d+\.\s+/.test(lines[i + 1])) {
        items.push(lines[i + 1]);
        i += 1;
      }
      const htmlItems = items
        .map(
          (item) => `<li>${inlineMarkdown(item.replace(/^\d+\.\s+/, ""))}</li>`,
        )
        .join("");
      blocks.push(`<ol>${htmlItems}</ol>`);
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushParagraph();
      blocks.push("<hr />");
      continue;
    }

    buffer.push(line.trim());
  }

  if (inCode) {
    blocks.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`);
  } else {
    flushParagraph();
  }

  return blocks.join("");
};

const setStatus = (text) => {
  pageStatus.textContent = text;
};

const renderNav = () => {
  nav.innerHTML = "";
  manifest.sections.forEach((section) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "nav-section";
    sectionEl.innerHTML = `<h3>${section.title}</h3>`;

    const links = document.createElement("div");
    links.className = "nav-links";

    section.items.forEach((item) => {
      const slug = item.slug || slugify(item.title || item.file);
      item.slug = slug;
      const link = document.createElement("a");
      link.href = `#${slug}`;
      link.textContent = item.title || slug;
      link.dataset.slug = slug;
      links.appendChild(link);
    });

    sectionEl.appendChild(links);
    nav.appendChild(sectionEl);
  });
};

const markActiveLink = (slug) => {
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.toggle("active", link.dataset.slug === slug);
  });
};

const findPage = (slug) => {
  for (const section of manifest.sections) {
    for (const item of section.items) {
      if (item.slug === slug) return item;
    }
  }
  return null;
};

const renderEmpty = (message) => {
  content.innerHTML = `<div class="empty">${message}</div>`;
};

const loadPage = async () => {
  if (!manifest) return;
  const slug =
    location.hash.replace("#", "") || manifest.sections[0].items[0].slug;
  const page = findPage(slug);
  markActiveLink(slug);

  if (!page) {
    pageTitle.textContent = "Missing page";
    pageSubtitle.textContent =
      "The link you followed does not exist in content/index.json.";
    setStatus("Not found");
    renderEmpty(
      "Add the page back into <code>content/index.json</code> or pick another link.",
    );
    return;
  }

  pageTitle.textContent = page.title || "Untitled";
  pageSubtitle.textContent = page.description || "";
  setStatus("Loading");

  try {
    const response = await fetch(`content/${page.file}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Missing file");
    }
    const raw = await response.text();
    const html = parseMarkdown(raw);
    content.innerHTML = html || "<p>Empty page.</p>";
    const headingMatch = raw.match(/^#\s+(.+)$/m);
    if (!page.title && headingMatch) {
      pageTitle.textContent = headingMatch[1].trim();
    }
    setStatus("Loaded");
  } catch (error) {
    pageTitle.textContent = "Missing file";
    pageSubtitle.textContent = `Could not load content/${page.file}.`;
    setStatus("Error");
    renderEmpty(
      "Create the file or fix the filename in <code>content/index.json</code>.",
    );
  }
};

const loadManifest = async () => {
  try {
    const response = await fetch(manifestPath, { cache: "no-store" });
    if (!response.ok) throw new Error("Missing manifest");
    manifest = await response.json();

    siteTitle.textContent = manifest.site?.title || "Neo CMS";
    siteTagline.textContent = manifest.site?.tagline || siteTagline.textContent;
    siteFooter.textContent = manifest.site?.footer || "";

    renderNav();
    await loadPage();
  } catch (error) {
    pageTitle.textContent = "Manifest missing";
    pageSubtitle.textContent =
      "Create content/index.json to map your markdown files.";
    setStatus("Setup");
    renderEmpty(
      "Create <code>content/index.json</code> and point it at markdown files. Use the sample in this repo as a template.",
    );
  }
};

window.addEventListener("hashchange", loadPage);
loadManifest();
