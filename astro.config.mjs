import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://taichi-okamoto.github.io',
  base: '/literary-works',
  trailingSlash: 'always',
  output: 'static',
});
