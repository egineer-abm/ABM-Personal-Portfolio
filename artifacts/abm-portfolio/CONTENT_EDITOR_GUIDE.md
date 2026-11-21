# Portfolio content editor guide

Use this guide to add or update writings, notes, project details, and startup descriptions. Content is stored in Markdown files; you do not need to edit React components for normal content updates.

## Where content lives

| Page | Folder | Item URL |
| --- | --- | --- |
| Writings | `src/content/writings/` | `/writings/<filename>` |
| Notes | `src/content/notes/` | `/notes/<filename>` |
| Projects | `src/content/projects/` | `/projects/<filename>` |
| Startups | `src/content/startups/` | Entries on `/startups` |

Use a lowercase, kebab-case filename ending in `.md`, such as `local-first-tools.md`. The filename becomes the URL slug. Startup descriptions are sections on the startups page; they do not have individual detail URLs.

## Add or edit a writing

Create a file in `src/content/writings/`, or edit an existing one:

```md
---
title: A clear, specific title
date: November 2026
tags: software, ai
order: 10
excerpt: A short preview that tells readers what the piece explores.
---

Start with the main idea. Use short paragraphs and descriptive headings
to help readers follow the argument.

## A section heading

Add examples, lists, links, or code where they help explain the idea.
```

Fields:

- `title`: display title; otherwise derived from the filename.
- `date`: date or status text shown in the list and article.
- `tags`: comma-separated labels.
- `order`: optional number; lower numbers appear first. Equal values are sorted by title.
- `excerpt`: short summary shown in the writings list and article introduction. If omitted, the first body line is used.

## Add or edit a note

Create a file in `src/content/notes/`, or edit an existing one:

```md
---
title: A useful observation
date: November 2026
tags: learning, tools
order: 10
---

Write the idea in a few focused paragraphs. A note can stay unfinished;
it does not need to become a full essay.
```

Notes use `title`, `date`, `tags`, and `order`. The title defaults to the filename. Notes do not have an excerpt field.

## Add or edit a project

Create a file in `src/content/projects/`, or edit an existing one:

```md
---
title: Project Name
eyebrow: Short label shown in the project list
category: Tools
status: Working prototype
year: 2026
stack: TypeScript, React, Vite
order: 10
description: One sentence describing the project; shown on its detail page and related-project cards.
links: Source code | https://github.com/account/project, Live demo | https://example.com
---

Describe the problem, what you built, and any useful outcome in one
plain-text paragraph.
```

Fields:

- `title`: display title; otherwise derived from the filename.
- `eyebrow`: short subtitle shown in the project list.
- `category`: project filter and detail-page label. Categories are generated from the content.
- `status`, `year`, `stack`: shown in the project details; stack is a comma-separated list.
- `order`: optional number; lower numbers appear first. Equal values are sorted by title.
- `description`: short summary for the detail-page introduction and related-project cards.
- `links`: optional comma-separated `Label | URL` pairs.
- `featured`: currently parsed but has no visible effect; do not rely on it to highlight a project.

The project detail body is currently displayed as plain text, not formatted Markdown. Keep it to one paragraph; headings, lists, and Markdown link syntax will not be rendered as formatted content.

## Add or edit a startup

Create a file in `src/content/startups/`, or edit an existing one:

```md
---
name: Startup Name
role: Founder
year: 2026–
status: Building
tagline: A concise one-line description of the venture.
order: 10
tags: education, software
url: https://example.com
urlLabel: Visit site
---

Explain who the startup serves, the problem it addresses, and what it
is building.

## Current focus

- Describe a concrete product or activity.
- Keep claims and progress up to date.
```

Fields:

- `name`: display name; otherwise derived from the filename.
- `role`, `year`, `status`: optional details shown beside the description.
- `tagline`: larger lead sentence above the description.
- `order`: optional number; lower numbers appear first. Equal values are sorted by name.
- `tags`: comma-separated labels.
- `url`: optional external website link.
- `urlLabel`: link text; defaults to `Visit`.

The description supports the Markdown features listed below.

## Markdown and frontmatter rules

Writings, notes, and startup descriptions support paragraphs, headings (`#` through `####`), unordered and numbered lists, blockquotes, horizontal rules, fenced code blocks, and inline bold, italic, code, and links such as `[Project site](https://example.com)`.

Frontmatter is the text between the opening and closing `---` lines. Use one simple `key: value` per line; this site uses a lightweight parser, not full YAML. Lists belong on one line and are comma-separated. For project links, separate each label and URL with `|`, then separate pairs with commas. Avoid commas inside individual tags or link pairs.

Files whose names start with `_` are ignored by the site; the folder `_README.md` files are examples and instructions, not content entries.

## Preview and publish

From the repository root, run the local site:

```powershell
pnpm.cmd --filter @workspace/abm-portfolio dev
```

Open the local URL printed by Vite and check the list page and the new item. For example, `my-essay.md` should appear at `/writings/my-essay`.

Before publishing, build the portfolio:

```powershell
pnpm.cmd --filter @workspace/abm-portfolio build
```

The build refreshes the sitemap for project, writing, and note detail URLs. Startup entries remain on `/startups`. Push the change to `main` to trigger the GitHub Pages deployment workflow.

To remove an item, delete its `.md` file. To reorder items, adjust their `order` values.
