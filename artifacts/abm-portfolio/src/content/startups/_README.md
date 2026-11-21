# How to edit the Startups page

Everything on `/startups` comes from the `.md` files in this folder. Edit them like any markdown file and the site updates (hot reload in dev).

For the complete field reference, formatting limits, preview, and publishing steps, see the [Content editor guide](../../../CONTENT_EDITOR_GUIDE.md).

## Add a startup

Create a new file named after the startup, e.g. `my-startup.md`. Its filename identifies the entry internally; startup descriptions appear on `/startups` and do not have individual detail URLs.

```md
---
name: My Startup
role: Founder
year: 2026–
status: Building
order: 5
tags: ai, tools
tagline: One-line pitch shown above the description.
url: https://example.com
urlLabel: Visit site
---

Write the full description here in **markdown**.

### Sections work too

- bullet lists
- [links](https://example.com)
- `inline code`
- blockquotes and numbered lists

> Everything between the `---` fences is frontmatter; everything below is the body.
```

## Frontmatter fields

| Field    | Required | Notes                                        |
| -------- | -------- | -------------------------------------------- |
| name     | no       | Defaults to the filename                     |
| role     | no       | Shown in accent color (e.g. `Founder`)       |
| year     | no       | e.g. `2024–`                                 |
| status   | no       | e.g. `Building`, `Active`, `Exploring`       |
| tagline  | no       | Lead line rendered larger above the body     |
| order    | no       | Lower numbers appear first on the page       |
| tags     | no       | Comma-separated                              |
| url      | no       | External link button                         |
| urlLabel | no       | Button label (defaults to `Visit`)           |

## Notes

- Files starting with `_` (like this one) are ignored by the site.
- Delete a file to remove that startup from the page.
