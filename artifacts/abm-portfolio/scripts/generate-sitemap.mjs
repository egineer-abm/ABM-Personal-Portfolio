import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, '..');
const publicDir = path.join(appDir, 'public');
const contentDir = path.join(appDir, 'src', 'content');
const origin = 'https://www.engrabm.com';

const routes = ['/', '/projects', '/writings', '/notes', '/about', '/experience', '/publications', '/startups', '/contact'];

for (const collection of ['projects', 'writings', 'notes']) {
  const directory = path.join(contentDir, collection);
  const files = await readdir(directory);

  for (const file of files) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    routes.push(`/${collection}/${file.slice(0, -3)}`);
  }
}

const urls = [...new Set(routes)]
  .sort((a, b) => a.localeCompare(b))
  .map((route) => `  <url><loc>${origin}${route === '/' ? '/' : route}</loc></url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap);
