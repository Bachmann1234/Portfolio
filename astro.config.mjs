import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static brochure site — emit plain HTML/CSS to dist/, served by Cloudflare
// exactly like the current setup. No SSR adapter needed.
export default defineConfig({
  site: 'https://mattbachmann.dev',
  output: 'static',
  integrations: [sitemap()],
});
