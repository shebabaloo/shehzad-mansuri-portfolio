# Design Brief — The Living Score

## Governing Idea

Shehzad's life unfolds as an accumulating musical score. An undefined stellar field
gradually reveals five gathering musical paths; a small monochrome folio appears later
as a quiet origin clue. The paths resolve into a staff, then a knowledge graph, then a
career chronology. The score remains the primary metaphor.

The book is a quiet origin point, not a hero object, mysterious artifact, or blocking
loading screen. Second Brain relationships appear as harmonies and annotations, not a
dashboard.

## Approved Opening Sequence

1. A centered welcome introduces The Living Score in a dense charcoal field of
   undefined particles with restrained, non-uniform twinkling. No spiral paths are
   visible initially.
2. On scroll, the stars gather into notation-like fragments and gradually reveal five
   arms of a score galaxy.
3. Clear skip, action, and scroll affordances make the opening optional and legible.
4. A small black-and-ivory line-art folio appears later near the core, opens subtly, and
   recedes. It remains secondary to the score galaxy.
5. The five paths unwind and straighten into one authored staff object.
6. Beginning at the 82% reference state, every sampled point on the horizontal staff
   interpolates toward its corresponding point on the vertical five-line rail. The
   resulting diagonal-to-vertical sweep reads as the same object flipping orientation,
   not lines traveling toward a separate scrollbar or a second staff rotating over it.
7. “The Personal Score of Shez” holds on the dark field. Product Thinking, Systems
   Building, and Curious by Default enter as three independent scroll additions.
8. Only after those additions does the same canvas field invert to warm paper. A coral
   treble clef joins the Shez lockup and a small Movement I cadence enters at the bottom
   edge. The resolved title then scrolls away while the Movement I staff and “A life in
   progress” fade and rise into the viewport. The fixed notated rail becomes the sole
   persistent navigation instrument; the native browser scrollbar remains visually
   hidden without changing native scrolling.

The book cover does not display Shehzad's name. It uses a custom score/node symbol.

The opening and editorial landing are joined by the expanding paper light and shared
cream/coral typography. Do not return to a black-on-black floating artifact, realistic
space scene, or an abrupt hard cut between palettes.

## Color Strategy — Committed

All implementation colors use OKLCH.

- Field: soft charcoal resolving into warm ivory and oatmeal, never pure white
- Signal: hot coral/vermilion
- Paper: warm ivory, never pure white
- Structure: muted brass linework
- Counterpoint: tiny electric-cobalt accents

Palette changes behave like harmonic modulation rather than hard section cuts. The
opening resolves through night → warm umber → parchment → ivory, with light rising
from the lower edge. Typography remains ivory through the umber register and switches
to ink only after the field is light enough to preserve contrast. Later paper sections
use long vertical transitions around their shared staff, and the Coda reverses the
sequence through parchment and sepia into charcoal. Do not interpolate directly
through neutral gray or apply a generic full-screen crossfade.

The resolved “Personal Score of Shez” hold sits specifically in a pale oatmeal register:
lighter than parchment and slightly deeper than Movement I ivory. The dark and umber
phases must finish while the staff is still moving so the held title state already feels
illuminated.

## Typography

- Display: a tall editorial serif with pronounced contrast
- Body: a warm humanist sans, selected for long-form readability
- Utility: compact mono or grotesk for dates, movement labels, and navigation
- Body measure: 65–72 characters
- Minimum modular scale ratio: 1.25

Do not use Inter, Roboto, or a generic system font as the primary face.

## Layout

- Opening: centered title field, deterministic stellar particles, delayed five-path
  spiral reveal, secondary folio, and a restrained seven-part movement key
- Editorial story: asymmetric movement layouts with the score line crossing section
  boundaries
- Career: Pascal-inspired reverse chronology, with dates, restrained organization
  identity, role, and only verified accomplishments
- Mobile: one vertical score, conventional content order, and compact chapter navigator

## Motion

- Native scroll is always preserved; no scroll-jacking.
- Wodniack is the primary reference for desktop pacing and spatial continuity.
- Raw document scroll remains the source of truth. One pinned GSAP ScrollTrigger maps
  native progress into a reversible scene timeline with a restrained numeric scrub.
- Animate only transform and opacity for HTML elements.
- SVG stroke drawing and path state changes may follow scroll progress.
- The opening is one reversible geometry chain: stars → notation fragments → five-path
  spiral score → horizontal staff → right-edge bend → fixed vertical staff rail. The
  folio is a brief clue inside this chain, not its visual source of truth.
- Entrance easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Exit easing: `cubic-bezier(0.64, 0, 0.78, 0)`.
- Avoid bounce, elastic easing, continuous large parallax, and camera zoom.
- The book responds subtly to pointer movement only on fine-pointer devices.

## Progressive Enhancement

- Semantic content exists in the DOM before animation runs.
- No JavaScript: static cover, visible sections, anchor navigation, vertical timeline.
- Reduced motion: immediate paper crossfade, fully drawn score, no page/parallax motion.
- Coarse pointer: no cursor-following behavior.
- Fine pointer: the initial stellar field uses restrained depth parallax and local
  repulsion around the cursor. This interaction fades out over the first 12% of scroll
  so it cannot interfere with particle gathering or score extraction.

## Performance Targets

- Initial JavaScript target: under 150 KB compressed. The current production build is
  approximately 111 KB gzip for JavaScript.
- LCP target: under 2.5 seconds on a typical mobile connection.
- No WebGL, Three.js, autoplay video, or generated cinematic assets in the opening.
- Canvas is permitted only for the deterministic 1,200-particle field and its five
  authored paths; semantic content,
  navigation, book geometry, staff, and editorial layout remain DOM/CSS/inline SVG.
- GSAP owns the shared scroll timeline. Do not add a second smoothing system until the
  native-scroll version is tuned and a clear motion deficit remains.

The installed `scroll-world` skill is a separate cinematic-render experiment. Its
pre-rendered video pipeline must not replace the native prototype until its journey,
camera grammar, calibrated cost, seams, and content legibility are explicitly approved.

## Anti-Patterns

- No planets, literal constellations, celestial orbits, photoreal space, or cosmic
  loading-screen framing. The approved abstract score-galaxy field is the exception:
  it must remain typographic, sparse in color, and visibly gather into score geometry.
- No fantasy-book ornamentation.
- No music-note clip art or literal piano keys.
- No generic cards or dashboard grid.
- No fake company logos.
- No glassmorphism or gradient text.
- No visual intro that behaves like a loading screen.

## Prototype Gate

The opening, right-edge rail, editorial landing, career measures, systems voices,
experiments, personal ensemble, and coda now form the desktop production foundation.
Iterate desktop motion and content first; mobile remains intentionally deferred.
