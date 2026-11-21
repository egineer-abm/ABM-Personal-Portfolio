# How to edit the Writings page

Everything on `/writings` comes from the `.md` files in this folder. Edit them like any markdown file and the site updates (hot reload in dev).

## Add a writing

Create a new file, e.g. `my-essay.md` (the filename becomes the URL slug):

```md
---
title: My Essay
date: A working draft
tags: software, ai
order: 4
excerpt: One-sentence teaser shown on the Writings list page.
---

The full essay body goes here as normal markdown.

### Sections work

- bullet lists
- [links](https://example.com)
- > blockquotes
- numbered lists and `inline code`
```

## Frontmatter fields

| Field   | Required | Notes                                  |
| ------- | -------- | -------------------------------------- |
| title   | no       | Defaults to the filename               |
| date    | no       | e.g. `In progress`, `March 2026`       |
| tags    | no       | Comma-separated                        |
| order   | no       | Lower numbers appear first             |
| excerpt | no       | Teaser line on the list page           |

The body is what readers see on `/writings/<slug>`.

## Notes

- Files starting with `_` are ignored by the site.
- Delete a file to remove the writing.
