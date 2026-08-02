import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { EditorialMovement } from '@/components/editorial-movement'
import { ScoreBody } from '@/components/score-body'
import { SiteHeader } from '@/components/site-header'
import { OriginBook } from '@/components/ui/origin-book'
import { ScoreRail, type ScoreRailHandle } from '@/components/ui/score-rail'
import { SpiralScore, type SpiralScoreHandle } from '@/components/ui/spiral-score'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Two registers rather than one flat list. The old key mixed chapter names (Work,
// Systems, Experiments) with Interlude sub-items (Books, Games, Music, Movement), which
// read as one level of structure when it was two.
const movementKey = [
  { group: 'In motion', items: ['Work', 'Systems', 'Ideas'] },
  { group: 'Off the clock', items: ['Literature', 'Games', 'Movement', 'Coffee', 'Music'] },
]

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start))

export function App() {
  const overtureRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<SpiralScoreHandle>(null)
  const railRef = useRef<ScoreRailHandle>(null)

  useGSAP(() => {
    const overture = overtureRef.current
    const sticky = stickyRef.current
    if (!overture || !sticky) return

    // Page progress is wayfinding, not decoration, so it is wired up before the
    // reduced-motion branch. It used to be created after, which meant anyone with reduced
    // motion lost the rail entirely — on a 17,900px page that is the one indicator they
    // most need, and it costs no animation to provide.
    const railTrigger = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => railRef.current?.setProgress(self.progress),
    })

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      spiralRef.current?.setProgress(0.6)
      railRef.current?.setVisible(1)
      railRef.current?.setProgress(0)
      return () => railTrigger.kill()
    }

    const progress = { value: 0 }

    const render = () => {
      const p = progress.value
      const staff = range(p, 0.38, 0.72)
      const railReveal = range(p, 0.88, 0.94)
      const title = range(p, 0.68, 0.78)
      const paper = range(p, 0.72, 0.95)
      const inkTone = range(p, 0.82, 0.9)
      const descriptorOne = range(p, 0.77, 0.82)
      const descriptorTwo = range(p, 0.82, 0.87)
      const descriptorThree = range(p, 0.87, 0.92)
      const handoff = range(p, 0.95, 0.995)

      sticky.style.setProperty('--scene-progress', p.toFixed(4))
      sticky.style.setProperty('--intro-opacity', (1 - range(p, 0.03, 0.25)).toFixed(4))
      sticky.style.setProperty('--intro-y', `${(-18 * range(p, 0.04, 0.3)).toFixed(2)}px`)
      document.documentElement.style.setProperty('--header-opacity', (1 - range(p, 0.02, 0.24)).toFixed(4))
      document.documentElement.style.setProperty('--rail-paper-tone', inkTone.toFixed(4))
      // The cursor flips on the same signal the typography does, so it stops being ink the
      // moment the field stops being able to support ink. Paper is the default state, so a
      // no-JS render still gets the correct cursor for the paper body.
      document.documentElement.classList.toggle('is-night-field', inkTone < 0.5)
      sticky.style.setProperty('--node-opacity', (1 - range(p, 0.32, 0.74)).toFixed(4))
      sticky.style.setProperty('--spiral-opacity', '1')
      sticky.style.setProperty('--origin-open', range(p, 0.28, 0.43).toFixed(4))
      sticky.style.setProperty('--origin-opacity', (range(p, 0.2, 0.32) * (1 - range(p, 0.43, 0.58))).toFixed(4))
      sticky.style.setProperty('--origin-y', `${(-6 * range(p, 0.28, 0.5)).toFixed(2)}px`)
      sticky.style.setProperty('--staff-opacity', staff.toFixed(4))
      sticky.style.setProperty('--staff-dash', (900 - staff * 900).toFixed(2))
      sticky.style.setProperty('--paper-reveal-opacity', '0')
      sticky.style.setProperty('--title-opacity', title.toFixed(4))
      sticky.style.setProperty('--title-y', `${((1 - title) * 2.6).toFixed(3)}rem`)
      sticky.style.setProperty('--title-x', '0vw')
      sticky.style.setProperty('--paper-tone', inkTone.toFixed(4))
      sticky.style.setProperty('--descriptor-opacity', descriptorOne.toFixed(4))
      sticky.style.setProperty('--descriptor-y', `${((1 - descriptorOne) * 1.2).toFixed(3)}rem`)
      sticky.style.setProperty('--descriptor-1', descriptorOne.toFixed(4))
      sticky.style.setProperty('--descriptor-2', descriptorTwo.toFixed(4))
      sticky.style.setProperty('--descriptor-3', descriptorThree.toFixed(4))
      sticky.style.setProperty('--handoff-opacity', handoff.toFixed(4))
      sticky.style.setProperty('--handoff-y', `${((1 - handoff) * 1.4).toFixed(3)}rem`)
      sticky.style.setProperty('--scroll-opacity', (1 - range(p, 0.04, 0.22)).toFixed(4))
      spiralRef.current?.setProgress(p)
      railRef.current?.setVisible(railReveal)
    }

    const sceneTween = gsap.to(progress, {
      value: 1,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: overture,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1,
        invalidateOnRefresh: true,
        // This tween owns document-level state — header colour and the night-field flag —
        // and a scrub tween does not re-run once scroll is past its end. Movement II's pin
        // calls ScrollTrigger.refresh(), which resets the tween to progress 0; render()
        // then never fired again, stranding `--header-opacity: 1` and `is-night-field` on
        // the paper body. The header is cream, the paper is cream, and its label text
        // vanished while its coral children stayed — orphan glyphs at the top of Movement
        // II. Re-syncing on refresh keeps the flags honest at whatever scroll we are at.
        onRefresh: (self) => { progress.value = self.progress; render() },
      },
    })

    const firstMovement = document.getElementById('first-movement')
    const firstMovementContent = firstMovement?.querySelectorAll('.paper-score, .editorial-shell')
    const movementTween = firstMovement && firstMovementContent?.length
      ? gsap.fromTo(firstMovementContent,
          { opacity: 0, y: 46 },
          {
            opacity: 1, y: 0, ease: 'none', stagger: 0.08,
            scrollTrigger: { trigger: firstMovement, start: 'top 92%', end: 'top 24%', scrub: 0.8 },
          },
        )
      : null

    render()
    railRef.current?.setProgress(0)

    return () => {
      document.documentElement.style.removeProperty('--header-opacity')
      document.documentElement.style.removeProperty('--rail-paper-tone')
      sceneTween.kill()
      railTrigger.kill()
      movementTween?.kill()
    }
  }, { scope: overtureRef })

  const advanceScore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const overture = overtureRef.current
    if (!overture || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    event.preventDefault()
    const travel = overture.offsetHeight - window.innerHeight
    window.scrollTo({ top: overture.offsetTop + travel * 0.42, behavior: 'smooth' })
  }

  return (
    <>
      <a className="skip-link" href="#first-movement">Skip the opening</a>
      <SiteHeader />
      <ScoreRail ref={railRef} />

      <main>
        <section ref={overtureRef} className="overture" id="overture" aria-labelledby="overture-title">
          <div ref={stickyRef} className="overture__sticky">
            <div className="atmosphere" aria-hidden="true">
              <div className="night-grain" />
              <div className="paper-reveal" />
            </div>

            <p className="movement-label">Prelude <span>·</span> A personal index</p>

            <div className="overture-copy">
              <p>Welcome to</p>
              <h1 id="overture-title">The Living <em>Score</em></h1>
              <p className="overture-copy__note">
                Shez’s evolving composition of work, systems, experiments,
                and the things that keep the whole score human.
              </p>
              <a className="enter-score" href="#first-movement" onClick={advanceScore}>
                Set it in motion <span>→</span>
              </a>
            </div>

            <div className="movement-key" aria-label="What is in The Living Score">
              {movementKey.map(({ group, items }) => (
                <div className="movement-key__group" role="list" aria-label={group} key={group}>
                  <p className="movement-key__label">{group}</p>
                  {items.map((item) => (
                    <span className={`movement-key__item movement-key__item--${item.toLowerCase()}`} role="listitem" key={item}>
                      <span className="movement-key__mark" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div className="spiral-stage">
              <SpiralScore ref={spiralRef} />
              <OriginBook />
            </div>

            <div className="opening-title" aria-hidden="true">
              <p className="opening-title__kicker">The personal score of</p>
              <span className="opening-title__mask">
                <span className="opening-title__name-lockup">
                  <span className="opening-title__clef">𝄞</span>
                  <h2>Shez</h2>
                </span>
              </span>
              <p className="opening-title__descriptor">
                <span className="opening-title__descriptor--1">Product thinking</span><i>·</i>
                <span className="opening-title__descriptor--2">Systems building</span><i>·</i>
                <span className="opening-title__descriptor--3">Curious by default</span>
              </p>
            </div>

            <div className="movement-handoff" aria-hidden="true">
              <span>Movement I</span>
              <i />
              <strong>A life in progress</strong>
              <b>↓</b>
            </div>

            <div className="scroll-cue" aria-hidden="true">
              <span>Scroll to conduct</span><i />
            </div>
          </div>
        </section>

        <EditorialMovement />
        <ScoreBody />
      </main>
    </>
  )
}
