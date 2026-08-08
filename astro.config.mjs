import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://beverleyy.github.io',
  base: '/hub-run',

  integrations: [tailwind({ applyBaseStyles: false })],
});
