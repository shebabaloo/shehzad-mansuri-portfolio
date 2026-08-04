/**
 * Smoke test for the built site.
 *
 * Every bug that has reached production on this site was invisible to the way it was
 * checked. The starfield shipped frozen through its whole night-to-paper transition because
 * a canvas colour string had been mangled by a rename, and `addColorStop` throws on a colour
 * it cannot parse: the exception killed each frame before it painted. A screenshot at rest
 * looked perfect, because the first frame throws once and every still frame afterwards
 * reuses the cached gradient. Even sampling pixels *after* a scroll settled looked perfect.
 * Only sampling every frame while the page was actually moving showed it.
 *
 * So this asserts the two things a screenshot cannot:
 *
 *   1. Nothing throws. An exception inside a requestAnimationFrame loop is silent — the loop
 *      survives, because the next frame was already scheduled — and it is the single most
 *      likely way for this site to break, since almost everything on it is canvas work
 *      driven by scroll.
 *   2. The animation actually animates. Scroll-driven canvases are stepped frame by frame
 *      through their range and the output has to keep changing. A canvas that has stopped
 *      painting is still a canvas full of pixels; only the lack of *change* gives it away.
 *
 * Plus the cheap structural checks worth having: no horizontal overflow, no duplicate ids,
 * no dead internal anchors, and the jump pill's visibility gate answering correctly for
 * arbitrary jumps rather than just for a scroll-through.
 *
 * Run against the built site, not the dev server, so it exercises what actually deploys.
 */

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { chromium } from 'playwright'

/* Serving dist in-process rather than shelling out to `vite preview`. A subprocess has to be
   waited on, its port can collide with a straggler from a previous run, and when it fails to
   start it does so silently — none of which a test harness should be spending its
   reliability budget on.
   The base prefix matters: CI builds with BASE_PATH set, so index.html asks for
   /<repo>/assets/... and a server rooted at dist would 404 every one of them. Stripping the
   prefix here means the smoke test exercises the same artifact that deploys. */
const BASE_PATH = (process.env.BASE_PATH || '/').replace(/\/*$/, '/')
const ROOT = new URL('../dist/', import.meta.url).pathname

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
}

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (BASE_PATH !== '/' && path.startsWith(BASE_PATH)) path = '/' + path.slice(BASE_PATH.length)
  if (path.endsWith('/')) path += 'index.html'
  // Contain the read to dist, so a traversal in a URL cannot escape it.
  const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''))
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const BASE = `http://127.0.0.1:${server.address().port}${BASE_PATH}`

const failures = []
const notes = []
const check = (name, ok, detail) => {
  if (ok) notes.push(`  ok    ${name}${detail ? ` — ${detail}` : ''}`)
  else failures.push(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
}

const shutdown = () => server.close()

// Fail loudly here rather than as thirty confusing check failures downstream.
const probe = await fetch(BASE).catch(() => null)
if (!probe || !probe.ok) {
  console.error(`smoke: dist is not servable at ${BASE} — run the build first`)
  shutdown()
  process.exit(1)
}

const browser = await chromium.launch()

/* The phone context emulates touch properly — isMobile and hasTouch, which is what makes
   `@media (pointer: coarse)` match in Chromium. That matters more than it sounds: the site
   has a whole block of touch-target rules that no tool in this project could previously
   verify, because the interactive browser reports `pointer: fine` at every width. Anything
   guarded by a coarse-pointer query was, until now, shipped on faith. */
const viewports = [
  { width: 1440, height: 900, label: 'desktop', touch: false },
  { width: 390, height: 844, label: 'phone', touch: true },
  // Landscape is where a bottom-anchored panel runs out of room; barely 390px of height.
  { width: 844, height: 390, label: 'phone-landscape', touch: true },
]

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
    deviceScaleFactor: viewport.touch ? 3 : 1,
  })
  const page = await context.newPage()

  const errors = []
  const notFound = []
  page.on('pageerror', (error) => errors.push(String(error.message)))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
  page.on('response', (response) => { if (response.status() === 404) notFound.push(new URL(response.url()).pathname) })

  await page.goto(BASE, { waitUntil: 'load' })

  /* Wait for the app to exist, not for a guessed number of milliseconds. A fixed delay is
     tuned to whichever machine it was written on: 1.2s was ample locally and too short on a
     cold CI runner, where the canvas had not mounted yet and the first check died on a null.
     A timing failure that looks like a product failure is worse than no test. */
  const v = (name) => `[${viewport.label}] ${name}`
  try {
    await page.waitForSelector('.spiral-canvas', { timeout: 20000 })
    await page.waitForSelector('#coda', { timeout: 20000 })
    // Mounted is not the same as sized and painted; the canvas gets its backing store from a
    // measured rect, and GSAP needs a frame to lay its triggers out.
    await page.waitForFunction(() => {
      const canvas = document.querySelector('.spiral-canvas')
      return canvas && canvas.width > 0 && document.documentElement.scrollHeight > window.innerHeight * 4
    }, { timeout: 20000 })
    await page.waitForTimeout(600)
  } catch (error) {
    // Say *why* it did not mount. A bare timeout sent me looking at render performance when
    // the real answer was that every asset had 404'd on a base-path mismatch.
    const missing = notFound.length ? ` — ${notFound.length} asset(s) 404'd, first: ${notFound[0]}` : ''
    check(v('app mounts'), false, `${String(error.message).split('\n')[0]}${missing}`)
    await context.close()
    continue
  }

  try {

  /* The overture, stepped frame by frame the way a reader scrolls it. Sampling one pixel of
     the starfield each frame and counting distinct values is the whole point: with the
     gradient bug present this reported 4 distinct tones across 61 frames and 95% of frames
     identical to the one before. Without it, 48 and 22% — and the 22% is the flat plateaus
     the tone ramp is specified to have at each end. */
  const tone = await page.evaluate(async () => {
    const canvas = document.querySelector('.spiral-canvas')
    const ctx = canvas.getContext('2d')
    const overture = document.getElementById('overture')
    const travel = overture.offsetHeight - window.innerHeight
    const read = () => ctx.getImageData(Math.round(canvas.width * 0.12), Math.round(canvas.height * 0.12), 1, 1).data[0]
    const seen = []
    const steps = 60
    for (let i = 0; i <= steps; i++) {
      window.scrollTo({ top: Math.round(overture.offsetTop + travel * (0.70 + 0.27 * i / steps)), behavior: 'instant' })
      await new Promise((r) => requestAnimationFrame(r))
      seen.push(read())
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    let frozen = 0
    for (let i = 1; i < seen.length; i++) if (seen[i] === seen[i - 1]) frozen++
    return { distinct: new Set(seen).size, frozenPct: Math.round((frozen / (seen.length - 1)) * 100), first: seen[0], last: seen[seen.length - 1] }
  })
  check(v('starfield animates through the paper transition'), tone.distinct >= 20,
    `${tone.distinct} distinct tones, ${tone.frozenPct}% frozen frames, ${tone.first}->${tone.last}`)
  check(v('starfield reaches paper'), tone.last > 200, `ends at ${tone.last}`)

  // Every canvas has to have painted something rather than sitting blank.
  const canvases = await page.evaluate(async () => {
    const out = {}
    const sample = (selector) => {
      const canvas = document.querySelector(selector)
      if (!canvas || !canvas.width) return { present: false }
      const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
      const seen = new Set()
      for (let i = 0; i < data.length; i += 4 * 997) seen.add(`${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`)
      return { present: true, distinct: seen.size }
    }
    const jump = async (id, offset) => {
      const el = document.querySelector(id)
      window.scrollTo({ top: Math.round(el.getBoundingClientRect().top + window.scrollY + offset), behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 600))
    }
    await jump('#overture', 0)
    out.starfield = sample('.spiral-canvas')
    await jump('.movement-transition', -200)
    out.transition = sample('.movement-transition canvas')
    await jump('#coda', 300)
    out.coda = sample('.coda-dispersal')
    window.scrollTo({ top: 0, behavior: 'instant' })
    return out
  })
  for (const [name, result] of Object.entries(canvases)) {
    check(v(`${name} canvas painted`), result.present && result.distinct > 1,
      result.present ? `${result.distinct} distinct colours` : 'canvas missing or zero-sized')
  }

  /* The jump pill's gate, exercised with instant jumps. Continuous scrolling always passes
     through Movement I, so a scroll-through can never catch the case that was broken: an
     IntersectionObserver reports crossings, not position, and jumping from the top straight
     to Movement IV — what the score index's own links do — crosses nothing. */
  const pill = await page.evaluate(async () => {
    const el = document.querySelector('.jump-index')
    const intro = document.getElementById('first-movement')
    const coda = document.getElementById('coda')
    const introEnd = Math.round(intro.getBoundingClientRect().top + window.scrollY + intro.offsetHeight)
    const codaTop = Math.round(coda.getBoundingClientRect().top + window.scrollY)
    const go = async (y) => {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 400))
      return el.dataset.shown
    }
    const cases = [
      ['top on load', 0, 'false'],
      ['jump top -> Movement IV', introEnd + 4000, 'true'],
      ['jump back to top', 0, 'false'],
      ['jump into Movement I', introEnd - 400, 'false'],
      ['jump past Movement I', introEnd + 300, 'true'],
      ['jump top -> Coda', codaTop + 400, 'false'],
      ['jump Coda -> top', 0, 'false'],
    ]
    const results = []
    for (const [name, y, expect] of cases) results.push({ name, expect, got: await go(y) })
    window.scrollTo({ top: 0, behavior: 'instant' })
    return results
  })
  for (const result of pill) {
    check(v(`jump pill: ${result.name}`), result.got === result.expect, `expected ${result.expect}, got ${result.got}`)
  }

  /* Everything in the overture that is supposed to fade must actually be gone by the end of
     it. The movement key learned this the hard way: its dots inherited their fade from being
     children of the items, and promoting them to siblings left them with nothing to inherit,
     so two coloured pins stayed at full strength on the paper long after their words had
     gone. Effective opacity, walked up the tree, is the only honest measure — a rule can be
     present on an element and still be defeated by where it sits. */
  const faded = await page.evaluate(async () => {
    const overture = document.getElementById('overture')
    const travel = overture.offsetHeight - window.innerHeight
    window.scrollTo({ top: Math.round(overture.offsetTop + travel * 0.98), behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 2000))
    const effective = (el) => {
      let opacity = 1
      for (let n = el; n && n !== document.body; n = n.parentElement) opacity *= parseFloat(getComputedStyle(n).opacity)
      return +opacity.toFixed(3)
    }
    const worst = {}
    for (const selector of ['.movement-key__mark', '.movement-key__label', '.movement-key__item', '.movement-label', '.scroll-cue', '.overture-copy']) {
      const nodes = [...document.querySelectorAll(selector)].filter((n) => n.offsetParent !== null || getComputedStyle(n).position === 'fixed')
      if (!nodes.length) continue // hidden at this viewport, nothing to assert
      worst[selector] = Math.max(...nodes.map(effective))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    return worst
  })
  for (const [selector, opacity] of Object.entries(faded)) {
    check(v(`${selector} fades out by the end of the overture`), opacity <= 0.02, `effective opacity ${opacity}`)
  }

  /* The index menu: the site's only persistent navigation, so it has to open, land, and
     close. Landing is the part worth asserting — an anchor that resolves is not the same as
     an anchor that arrives, and these jump across GSAP-pinned sections. */
  const menu = await page.evaluate(async () => {
    const root = document.querySelector('.jump-index')
    const toggle = root.querySelector('.jump-index__toggle')
    const panel = root.querySelector('.jump-index__panel')
    const settle = (ms) => new Promise((r) => setTimeout(r, ms))
    // Get somewhere the pill is shown.
    const experiments = document.getElementById('experiments')
    window.scrollTo({ top: Math.round(experiments.getBoundingClientRect().top + window.scrollY), behavior: 'instant' })
    await settle(500)

    const out = { shown: root.dataset.shown, entries: panel.querySelectorAll('a').length }
    out.closedInert = panel.hasAttribute('inert')
    toggle.click(); await settle(400)
    out.opens = root.dataset.open === 'true' && parseFloat(getComputedStyle(panel).opacity) > 0.9
    out.openNotInert = !panel.hasAttribute('inert')

    // Every destination must exist and be reachable.
    out.targets = [...panel.querySelectorAll('a')].map((a) => {
      const target = document.querySelector(a.getAttribute('href'))
      return { href: a.getAttribute('href'), exists: !!target }
    })

    // Pick one and confirm we actually arrive.
    const link = [...panel.querySelectorAll('a')].find((a) => a.getAttribute('href') === '#work')
    link.click(); await settle(1400)
    const workTop = document.getElementById('work').getBoundingClientRect().top
    out.landedOnWork = Math.abs(workTop) < window.innerHeight * 0.9
    out.closesOnPick = document.querySelector('.jump-index').dataset.open === 'false'

    // Reopen to measure geometry: a panel that works but hangs off the screen is not working.
    window.scrollTo({ top: Math.round(experiments.getBoundingClientRect().top + window.scrollY), behavior: 'instant' })
    await settle(500)
    toggle.click(); await settle(400)
    const box = panel.getBoundingClientRect()
    out.panel = { w: Math.round(box.width), h: Math.round(box.height), left: Math.round(box.left), top: Math.round(box.top) }
    out.fitsHorizontally = box.left >= 0 && box.right <= window.innerWidth + 1
    out.fitsVertically = box.top >= 0 && box.bottom <= window.innerHeight + 1
    out.rowHeights = [...panel.querySelectorAll('a')].map((a) => Math.round(a.getBoundingClientRect().height))
    out.coarse = window.matchMedia('(pointer: coarse)').matches
    toggle.click()

    window.scrollTo({ top: 0, behavior: 'instant' })
    return out
  })
  check(v('index menu lists every movement'), menu.entries === 6, `${menu.entries} entries`)
  check(v('index menu opens'), menu.opens === true)
  check(v('index menu closed is inert'), menu.closedInert === true && menu.openNotInert === true)
  check(v('index menu targets all exist'), menu.targets.every((t) => t.exists),
    menu.targets.filter((t) => !t.exists).map((t) => t.href).join(', '))
  check(v('index menu actually lands on its target'), menu.landedOnWork === true)
  check(v('index menu closes after a pick'), menu.closesOnPick === true)
  check(v('index menu fits the screen'), menu.fitsHorizontally && menu.fitsVertically,
    `panel ${menu.panel.w}x${menu.panel.h} at (${menu.panel.left},${menu.panel.top}) in ${viewport.width}x${viewport.height}`)
  check(v('coarse-pointer media query is in effect'), menu.coarse === viewport.touch,
    `matchMedia(pointer: coarse) = ${menu.coarse}`)

  /* Focus behaviour, driven through real input rather than element.click(). A programmatic
     click reports detail 0 — indistinguishable from Enter or Space, which is exactly the
     signal the component uses to decide whether to move focus. Testing it from inside
     evaluate() would have asserted the opposite of the truth. */
  await page.evaluate(() => {
    const el = document.getElementById('experiments')
    window.scrollTo({ top: Math.round(el.getBoundingClientRect().top + window.scrollY), behavior: 'instant' })
  })
  await page.waitForTimeout(500)

  await page.click('.jump-index__toggle')
  await page.waitForTimeout(350)
  const afterPointer = await page.evaluate(() => ({
    open: document.querySelector('.jump-index').dataset.open === 'true',
    onToggle: document.activeElement === document.querySelector('.jump-index__toggle'),
    where: document.activeElement.className || document.activeElement.tagName,
  }))
  check(v('pointer-opened menu leaves focus on the button'), afterPointer.open && afterPointer.onToggle,
    `open=${afterPointer.open}, focus on ${afterPointer.where}`)

  // Escape returns focus to the button, so Enter from there reopens by keyboard.
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(350)
  const afterKeyboard = await page.evaluate(() => ({
    open: document.querySelector('.jump-index').dataset.open === 'true',
    inPanel: !!document.activeElement.closest('.jump-index__panel'),
  }))
  check(v('keyboard-opened menu places focus in the list'), afterKeyboard.open && afterKeyboard.inPanel,
    `open=${afterKeyboard.open}, focus in panel=${afterKeyboard.inPanel}`)
  await page.keyboard.press('Escape')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  if (viewport.touch) {
    check(v('index menu rows meet the 44px touch minimum'), Math.min(...menu.rowHeights) >= 44,
      `rows ${menu.rowHeights.join('/')}`)
  }

  // The score rail has to name the section the reader is actually in.
  const rail = await page.evaluate(async () => {
    const chapters = [['overture', 'P'], ['first-movement', 'I'], ['work', 'II'], ['systems', 'III'], ['experiments', 'IV'], ['off-clock', 'V'], ['coda', 'VI']]
    const results = []
    for (const [id, expect] of chapters) {
      const el = document.getElementById(id)
      if (!el) { results.push({ id, expect, got: 'SECTION MISSING' }); continue }
      window.scrollTo({ top: Math.round(el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.42 + 30), behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 300))
      results.push({ id, expect, got: document.querySelector('.score-rail__chapter').textContent })
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    return results
  })
  const railWrong = rail.filter((r) => r.got !== r.expect)
  // The rail's chapter links are hidden on narrow viewports, but the numeral is always shown.
  check(v('score rail names the right chapter'), railWrong.length === 0,
    railWrong.length ? railWrong.map((r) => `${r.id}: want ${r.expect} got ${r.got}`).join('; ') : `${rail.length}/${rail.length}`)

  // Structure.
  const structure = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    duplicateIds: (() => { const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); return ids.filter((v, i) => ids.indexOf(v) !== i) })(),
    deadAnchors: [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')))]
      .filter((h) => h !== '#' && !document.querySelector(h)),
    h1Count: document.querySelectorAll('h1').length,
  }))
  check(v('no horizontal overflow'), !structure.overflow, `${structure.scrollWidth} vs ${structure.clientWidth}`)
  check(v('no duplicate ids'), structure.duplicateIds.length === 0, structure.duplicateIds.join(', '))
  check(v('no dead internal anchors'), structure.deadAnchors.length === 0, structure.deadAnchors.join(', '))
  check(v('exactly one h1'), structure.h1Count === 1, `found ${structure.h1Count}`)

  // Anything thrown anywhere above.
  check(v('no uncaught errors'), errors.length === 0, errors.slice(0, 3).join(' | '))

  } catch (error) {
    // A throw in the harness itself is a failure to report, not a stack trace to decode.
    check(v('smoke run completed'), false, String(error.message).split('\n')[0])
  }
  await context.close()
}

await browser.close()
shutdown()

console.log(notes.join('\n'))
if (failures.length) {
  console.error(`\nsmoke: ${failures.length} failure(s)\n${failures.join('\n')}`)
  process.exit(1)
}
console.log(`\nsmoke: all ${notes.length} checks passed`)
