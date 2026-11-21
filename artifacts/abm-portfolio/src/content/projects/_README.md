# How to edit the Projects page

Everything on `/projects` comes from the `.md` files in this folder. Edit them like any markdown file and the site updates (hot reload in dev). Push to GitHub and your host rebuilds with the new text.

For the complete field reference, formatting limits, preview, and publishing steps, see the [Content editor guide](../../../CONTENT_EDITOR_GUIDE.md).

## Add a project

Create a new file named after the project, e.g. `my-project.md` (the filename becomes the URL slug):

```md
---
title: My Project
eyebrow: One-line label shown under the title
category: AI
status: Working prototype
year: 2026
stack: React, FastAPI
order: 16
links: GitHub repo | https://github.com/abm1119/my-project, Live app | https://example.com
description: One-sentence summary shown on the detail page hero and related cards.
---

The longer "Notes on the build" description goes here as one plain-text paragraph.
```

## Frontmatter fields

| Field       | Required | Notes                                                        |
| ----------- | -------- | ------------------------------------------------------------ |
| title       | no       | Defaults to the filename                                     |
| eyebrow     | no       | Short label under the title in the list                      |
| category    | yes      | e.g. AI, Tools, Open source, Mobile, Hardware, Web, Game, CAD |
| status      | no       | e.g. `Open source`, `University project`                     |
| year        | no       | e.g. `2025`, `2024–`                                         |
| stack       | no       | Comma-separated list (first 3 shown in the list)             |
| featured    | no       | Parsed but currently has no visible effect                   |
| order       | no       | Lower numbers appear first on the page                       |
| links       | no       | Comma-separated `Label \| URL` pairs                         |
| description | no       | Short summary; the body below is the long story              |

## Notes

- Files starting with `_` (like this one) are ignored by the site.
- Delete a file to remove that project from the page.
- Changing `category` automatically creates or uses that filter tab.
- The project detail body is plain text; Markdown formatting is not rendered there.
