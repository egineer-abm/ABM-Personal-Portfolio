# How to edit the Notes page

Everything on `/notes` comes from the `.md` files in this folder. Edit them like any markdown file and the site updates (hot reload in dev).

## Add a note

Create a new file, e.g. `my-note.md` (the filename becomes the URL slug):

```md
---
title: My half-formed idea
date: ongoing
tags: software, tools
order: 4
---

The note body goes here. Keep it short — these are fragments before they become articles.
```

## Frontmatter fields

| Field | Required | Notes                            |
| ----- | -------- | -------------------------------- |
| title | no       | Defaults to the filename         |
| date  | no       | e.g. `ongoing`, `Aug 2026`       |
| tags  | no       | Comma-separated                  |
| order | no       | Lower numbers appear first       |

## Notes

- Files starting with `_` are ignored by the site.
- Delete a file to remove the note.
