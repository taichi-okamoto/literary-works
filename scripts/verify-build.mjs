import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const base = '/literary-works/';
const secret = '8seconds-k7m4q2';
const expected = [
  'index.html',
  'reader/8seconds-k7m4q2/index.html',
  'reader/8seconds-k7m4q2/read/index.html',
  'go/8seconds/index.html',
  'images/8seconds-cover.webp',
  'images/og.png',
  'robots.txt',
  'sitemap.xml',
];

const failures = [];
for (const file of expected) {
  if (!existsSync(join(dist, file))) failures.push(`Missing dist/${file}`);
}

const read = (path) => readFileSync(join(dist, path), 'utf8');
if (existsSync(join(dist, 'index.html')) && read('index.html').includes(secret)) {
  failures.push('Public index exposes the secret reader slug');
}

for (const file of [
  'reader/8seconds-k7m4q2/index.html',
  'reader/8seconds-k7m4q2/read/index.html',
  'go/8seconds/index.html',
]) {
  if (existsSync(join(dist, file)) && !/name="robots" content="noindex, nofollow"/.test(read(file))) {
    failures.push(`${file} is missing noindex, nofollow`);
  }
}

if (existsSync(join(dist, 'sitemap.xml')) && read('sitemap.xml').includes(secret)) {
  failures.push('Sitemap exposes the secret reader slug');
}
if (existsSync(join(dist, 'robots.txt')) && read('robots.txt').includes(secret)) {
  failures.push('robots.txt exposes the secret reader slug');
}

const target = `${base}reader/${secret}/`;
if (existsSync(join(dist, 'go/8seconds/index.html')) && !read('go/8seconds/index.html').includes(target)) {
  failures.push('QR relay target is incorrect');
}

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
};
if (existsSync(dist)) walk(dist);

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (!ref.startsWith(base)) continue;
    const clean = ref.slice(base.length).split(/[?#]/)[0];
    if (!clean) continue;
    const candidate = clean.endsWith('/') ? join(dist, clean, 'index.html') : join(dist, clean);
    if (!existsSync(candidate)) failures.push(`Broken internal reference in ${file}: ${ref}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verification PASS: ${expected.length} required outputs, ${htmlFiles.length} HTML pages, no exposed secret links.`);
