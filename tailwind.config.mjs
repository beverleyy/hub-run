/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    /* Mirrors theme/tailwind.config.mjs. Keep them in step: the aliases must
       resolve to the same semantic roles the theme's CSS assigns per livery. */
    extend: {
      colors: {
        'delta-navy': 'var(--c-primary)',
        /* the alias name is historical; it resolves to the semantic highlight
           role, so text-/border-/bg-delta-red follows whichever palette colour
           the active livery assigns to that role */
        'delta-red': 'var(--c-highlight)',
        'delta-sky': 'var(--c-sky)',
        'delta-slate': '#F4F5F7',
      },
    },
  },
  plugins: [],
};
