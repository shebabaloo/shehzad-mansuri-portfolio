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
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
