import { defineConfig } from 'astro/config';

// Static brochure site — emit plain HTML/CSS to dist/, served by Cloudflare
// exactly like the current setup. No SSR adapter needed.
export default defineConfig({
  output: 'static',
});
