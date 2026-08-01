import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const career = [
  {
    period: '2025—Now',
    org: 'Deloitte · FAANG company',
    team: 'Infrastructure & Data Centers',
    role: 'Technical Program Manager',
    lead: 'Turning complex infrastructure work into products and programs people can actually operate.',
    beats: [
      'Led the launch and stabilization of an enterprise site-selection platform across product, engineering, data, and operations.',
      'Authored requirements for an internal planning tool designed to replace a fragmented roadmap cycle with a shared source of truth.',
      'Helped shift an infrastructure reporting product from a periodic artifact toward an everyday insights tool.',
    ],
  },
  {
    period: '2024—2025',
    org: 'Deloitte · FAANG company',
    team: 'AI Privacy',
    role: 'Program Manager',
    lead: 'Creating a shared rhythm where product velocity, policy, legal, and privacy had to move together.',
    beats: [
      'Brought product, legal, policy, and privacy partners into a shared roadmap rhythm.',
      'Synthesized release risks and open decisions into clearer planning inputs.',
    ],
  },
  {
    period: '2024—Now',
    org: 'Deloitte',
    team: 'AI & Engineering',
    role: 'Consultant',
    lead: 'Learning to enter unfamiliar systems, find the thread quickly, and earn trust through useful work.',
    beats: [],
  },
]

const systems = [
  ['01', 'Personal Workspace', 'Active', 'A files-first knowledge and action space connecting projects, reading, decisions, and ideas.', 'Capture → connect → act'],
  ['02', 'Second Brain', 'Active pattern', 'A personal operations layer that turns scattered context into preparation, follow-through, and durable memory.', 'Context → synthesis → next move'],
  ['03', 'Team Third Brain', 'Active pattern', 'The shared version: individual context stays personal while agreed knowledge becomes reusable team infrastructure.', 'Individual context ↔ shared clarity'],
  ['04', 'The Living Score', 'In progress', 'Part portfolio, part interface experiment—a way to make the system legible without turning it into a dashboard.', 'Structure → story'],
]

const variations = [
  {
    number: 'Variation I', title: 'Restaurant / Café Ranker', status: 'In the sketchbook',
    question: 'What if your saved places became a personal guide your friends could actually use?',
    copy: 'A shareable, filterable map of places I’d genuinely recommend—organized by cuisine, neighborhood, price, and vibe.',
  },
  {
    number: 'Variation II', title: 'Intentional YouTube', status: 'In the sketchbook',
    question: 'What if video discovery optimized for learning intent instead of watch time?',
    copy: 'A calmer front door to YouTube that turns a topic into a taste-aware learning path, with focus and exploration treated as different modes.',
  },
]

const interests = [
  {
    id: 'books', mark: 'Aa', label: 'Books & philosophy', title: 'Some ideas need more than a tab.',
    copy: 'Fiction for scale. Philosophy for friction. Notes for everything I’m not done thinking about.',
    items: ['The Way of Kings', 'The Myth of Sisyphus', 'Meditations'],
  },
  {
    id: 'games', mark: '◇', label: 'Games', title: 'Worlds that stay after the credits.',
    copy: 'Story-rich worlds, difficult choices, and the strange intimacy of learning a place by moving through it.',
    items: ['The Last of Us', 'Ghost of Tsushima', 'Final Fantasy VII'],
  },
  {
    id: 'music', mark: '♭', label: 'Music', title: 'Before systems, there were ensembles.',
    copy: 'I played clarinet and bass clarinet for seven years. Orchestral music and jazz are still in the rotation.',
    items: ['Clarinet', 'Bass clarinet', 'Orchestral & jazz'],
  },
  {
    id: 'movement', mark: '↗', label: 'Movement', title: 'The score needs a pulse.',
    copy: 'Most weeks, that means the gym or a volleyball court—the useful kind of focus where the next touch is the only thing that matters.',
    items: ['Volleyball', 'Gym', 'Reset'],
  },
]

function SectionStaff() {
  return (
    <svg className="section-staff" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
      {[18, 29, 40, 51, 62].map((y) => <path key={y} d={`M0 ${y}C290 ${y} 430 ${y - 8} 650 ${y}S970 ${y + 8} 1200 ${y}`} />)}
    </svg>
  )
}

export function ScoreBody() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-score-reveal]').forEach((element) => {
        gsap.fromTo(element,
          { y: 44, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power4.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          },
        )
      })
    })
    return () => media.revert()
  }, { scope: rootRef })

  return (
    <div ref={rootRef} className="score-body">
      <section className="score-section work-movement" id="work" aria-labelledby="work-title">
        <SectionStaff />
        <header className="movement-heading" data-score-reveal>
          <p>Movement II <span>·</span> Work in motion</p>
          <h2 id="work-title">Turning ambiguity into something <em>teams can use.</em></h2>
          <p className="movement-intro">My work sits between product, program, and systems thinking—defining the shape, aligning the people, and staying through launch.</p>
        </header>

        <div className="career-score">
          {career.map((entry, index) => (
            <article className="career-measure" data-score-reveal key={`${entry.period}-${entry.team}`}>
              <div className="rehearsal-mark"><span>{String.fromCharCode(65 + index)}</span><p>{entry.period}</p></div>
              <div className="career-measure__identity">
                <p>{entry.org}</p><span>{entry.team}</span>
                <h3>{entry.role}</h3>
              </div>
              <div className="career-measure__score">
                <p className="career-lead">{entry.lead}</p>
                {entry.beats.length > 0 && <ul>{entry.beats.map((beat) => <li key={beat}>{beat}</li>)}</ul>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="score-section systems-movement" id="systems" aria-labelledby="systems-title">
        <SectionStaff />
        <header className="movement-heading movement-heading--compact" data-score-reveal>
          <p>Movement III <span>·</span> Systems that compound</p>
          <h2 id="systems-title">Building the thing <em>behind the work.</em></h2>
          <p className="movement-intro">What should the system remember, connect, or do so a person doesn’t have to start from zero again?</p>
        </header>

        <div className="counterpoint" aria-label="Systems progressing from personal context to shared output">
          {systems.map(([number, title, status, copy, principle]) => (
            <article className="system-voice" data-score-reveal key={number}>
              <span className="system-voice__number">{number}</span>
              <div><p className="system-voice__status">{status}</p><h3>{title}</h3></div>
              <p>{copy}</p>
              <strong>{principle}</strong>
            </article>
          ))}
          <span className="counterpoint__chord" aria-hidden="true"><i /><i /><i /></span>
        </div>
      </section>

      <section className="score-section variations-movement" id="experiments" aria-labelledby="variations-title">
        <header className="movement-heading movement-heading--compact" data-score-reveal>
          <p>Movement IV <span>·</span> Variations</p>
          <h2 id="variations-title">Ideas worth giving a <em>first playable form.</em></h2>
          <p className="movement-intro">Not polished companies or finished case studies—questions I’d like to test by making something small and real.</p>
        </header>
        <div className="variation-score">
          {variations.map((variation) => (
            <article className="variation" data-score-reveal key={variation.title}>
              <div className="variation__meta"><span>{variation.number}</span><b>{variation.status}</b></div>
              <div><h3>{variation.title}</h3><p className="variation__question">{variation.question}</p></div>
              <p className="variation__copy">{variation.copy}</p>
              <span className="variation__motif" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="score-section ensemble-movement" id="off-clock" aria-labelledby="ensemble-title">
        <header className="movement-heading movement-heading--compact" data-score-reveal>
          <p>Interlude <span>·</span> Off the clock</p>
          <h2 id="ensemble-title">The things that keep the score <em>human.</em></h2>
        </header>
        <div className="ensemble-score">
          {interests.map((interest, index) => (
            <article className={`personal-measure personal-measure--${index + 1}`} id={interest.id} data-score-reveal key={interest.id}>
              <span className="personal-measure__mark" aria-hidden="true">{interest.mark}</span>
              <div className="personal-measure__copy"><p>{interest.label}</p><h3>{interest.title}</h3><span>{interest.copy}</span></div>
              <ul>{interest.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="coda" id="coda" aria-labelledby="coda-title">
        <SectionStaff />
        <div className="coda__inner" data-score-reveal>
          <p>Coda <span>·</span> Still composing</p>
          <h2 id="coda-title">The next movement is <em>still unwritten.</em></h2>
          <p>If any of this sounds like a conversation worth having, say hello.</p>
          <nav aria-label="Contact and resume links">
            <a href="mailto:shehzadm7861@gmail.com">Email <span>↗</span></a>
            <a href="https://www.linkedin.com/in/shehzad-mansuri/">LinkedIn <span>↗</span></a>
            <a href="#first-movement">Return to the score <span>↑</span></a>
          </nav>
          <strong>— Shez<span>.</span></strong>
        </div>
      </section>
    </div>
  )
}
