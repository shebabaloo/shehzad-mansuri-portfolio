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
        const resolved = origin || (ctx.server ? 'http://127.0.0.1:5173' : '')
        if (!resolved) {
          this.warn?.(
            'SITE_URL is not set. og:url and og:image will be emitted as relative paths, ' +
              'which LinkedIn and X will not render as a link preview. ' +
              'Build with: SITE_URL=https://your-domain npm run build',
          )
        }
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
