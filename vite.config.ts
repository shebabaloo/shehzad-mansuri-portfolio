import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Open Graph needs absolute URLs — LinkedIn in particular will not resolve a relative
 * og:image, and LinkedIn is where this site actually gets shared. The canonical origin is
 * therefore a deploy-time input rather than something committed here.
 *
 * It is not read from `.env`, because `.env` is gitignored: a placeholder there would build
 * clean locally and ship a broken preview from CI with nothing to notice it. Instead the
 * origin comes from the SITE_URL environment variable, and a production build without one
 * prints a warning naming the consequence rather than failing silently.
 */
const siteUrl = (): Plugin => {
  const origin = (process.env.SITE_URL ?? '').replace(/\/$/, '')
  return {
    name: 'site-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!origin) {
          this.warn?.(
            'SITE_URL is not set, falling back to a localhost origin. Link previews will ' +
              'not resolve for anyone but you. ' +
              'Build for release with: SITE_URL=https://your-domain npm run build',
          )
        }
        // The fallback must stay absolute. An empty substitution leaves href="/", which
        // Vite's asset resolver then tries to read as a file and fails on with EISDIR,
        // because "/" resolves to the project root.
        const resolved = origin || (ctx.server ? 'http://127.0.0.1:5173' : 'http://localhost:4173')
        return html.replaceAll('%SITE_URL%', resolved)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  /**
   * Where the site sits on its host, which is not always the root.
   *
   * A custom domain serves from "/" and needs nothing. GitHub Pages without one serves
   * from "/<repo>/", and every hashed asset URL is written at build time — so a bundle
   * built for "/" requests /assets/index-abc.js, gets the 404 page, and renders blank.
   * Nothing in the app reports this; the page is simply empty.
   *
   * Set BASE_PATH to "/<repo>/" (leading and trailing slash) for that case, and drop it
   * again once a domain points at the root.
   */
  base: process.env.BASE_PATH || '/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
