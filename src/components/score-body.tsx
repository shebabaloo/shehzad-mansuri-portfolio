import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PassageToggle } from './ui/passage-toggle'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const career = [
  {
    period: '2025—Now',
    org: 'Deloitte · FAANG company',
    team: 'Infrastructure & Data Centers',
    role: 'Technical Program Manager',
    lead: 'Turning complex infrastructure work into products and programs people can actually operate.',
    beats: [
      'Stood up a cross-functional program and launched its MVP in under three weeks from conception—replacing spreadsheet workflows as the source of truth for 200+ stakeholders tracking a $60B+ investment portfolio.',
      'Compressed the product loop and accelerated team execution with proprietary AI tooling—PRDs, 50+ stakeholder journeys, prototypes, user testing, and tangible enhancements shipped to production apps.',
      'Owned the roadmap, releases, and documentation for a seven-module financial platform tracking $20B+ in spend, and covered the client program manager through a 90-day absence.',
    ],
  },
  {
    period: '2024—2025',
    org: 'Deloitte · FAANG company',
    team: 'AI Privacy',
    role: 'Program Manager',
    lead: 'Creating a shared rhythm where product velocity, policy, legal, and privacy had to move together.',
    beats: [
      'Led a workstream with three client privacy managers, facilitating roadmap reviews across 140+ GenAI product releases.',
      'Synthesized risk trends and briefed 40+ product, legal, and policy stakeholders to align on roadmap and mitigation.',
    ],
  },
  {
    period: '2024',
    org: 'Deloitte',
    team: 'Cybersecurity · Healthcare · Entertainment',
    role: 'PMO Analyst',
    lead: 'Three industries in one year—learning how differently each one defines a decision.',
    beats: [
      'Scoped a $10M+ market opportunity across customer-partner and outcomes programs for a cybersecurity client.',
      'Supported a $2M ERP MVP through user stories, RAID log, and status reporting for an entertainment client.',
      'Documented supplier scope for a Medicare divestiture, keeping compliance intact through the transition.',
    ],
  },
]

const systems = [
  {
    number: '01', title: 'Personal Workspace', status: 'Active',
    copy: 'A files-first knowledge and action space connecting projects, reading, decisions, and ideas. Plain text, plain folders, no lock-in—so the thinking outlives whichever tool is fashionable.',
    beats: [],
    principle: 'Capture → connect → act',
  },
  {
    number: '02', title: 'Second Brain', status: 'Active pattern',
    copy: 'A persistent operating layer around the work. The problem was never finding information—it was continuously understanding what mattered, what had changed, and what needed action. Every project switch used to mean rebuilding the whole mental model from scratch.',
    beats: [
      'Holds project state, decisions and their reasoning, dependencies, open commitments, and which sources are actually authoritative.',
      'Prepares meetings by answering what changed, what is still unresolved, and what outcome to drive toward—not by summarizing the last one.',
      'Signals continuously: what is approaching a deadline, what is blocked, what has quietly stopped moving, where two workstreams are drifting apart.',
      'Starts from the history of the work instead of a blank prompt, so a draft or a risk assessment arrives already grounded in context.',
      'Automates 8–11 hours of recurring coordination a week across 31 scheduled workflows, ingesting signal 115× faster than the manual scan it replaced.',
    ],
    principle: 'Context → synthesis → next move',
  },
  {
    number: '03', title: 'Team Third Brain', status: 'Active pattern',
    copy: 'The personal system helped me operate, but the team still ran on meetings, status requests, and hand-maintained documents. The Third Brain promotes the verified, team-relevant parts of that context into shared infrastructure.',
    beats: [
      'Private context stays private; decisions, ownership, milestones, and risks become the team’s institutional memory.',
      'Powers agendas, briefings, weekly updates, and onboarding material—so people benefit without operating the system themselves.',
      'Reduces the coordination tax: faster time to context, fewer repeated conversations, earlier risk detection, handoffs that survive transitions.',
      'The first team implementation serves 22 members with 93+ curated resources and 131 synchronized decisions—shared context went from roughly 14 hours stale to near real time.',
    ],
    principle: 'Individual context ↔ shared clarity',
  },
  {
    number: '04', title: 'The Living Score', status: 'In progress',
    copy: 'Part portfolio, part interface experiment—a way to make the system legible without turning it into a dashboard.',
    beats: [],
    principle: 'Structure → story',
  },
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
    passage: '*Born a Crime* was the first book I held as a star rather than an assignment—blue, soft-covered, heavier in the hand than its size accounted for. Percy Jackson told me what a hero was; Sydney Carton complicated it; in *Lord of the Flies* I argued, loudly and to nobody, that Simon’s kindness failed not because goodness is powerless but because he was never charismatic enough to be heard. I still prance through a bookstore the same way. The shelf is only harder now. Each one is another working style, another point of view, another gap between knowledge bases quietly closed. In this world, I seek to learn.',
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
  const careerStageRef = useRef<HTMLDivElement>(null)
  const careerTrackRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLSpanElement>(null)
  const [openPassage, setOpenPassage] = useState<string | null>(null)

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

    // Movement II: the three career measures advance horizontally under a fixed playhead
    // while the section is pinned. Native scroll still drives everything; the pin only
    // remaps vertical distance onto the staff's left-to-right reading direction.
    // Stacked reading: the measures scroll vertically, so they reveal like every other
    // block. In the pinned horizontal mode below they are visible from the start and the
    // sideways advance is the choreography instead.
    media.add('(prefers-reduced-motion: no-preference) and (max-width: 860px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-measure-reveal]').forEach((element) => {
        gsap.fromTo(element,
          { y: 44, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power4.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          },
        )
      })
    })

    media.add('(prefers-reduced-motion: no-preference) and (min-width: 861px)', () => {
      const stage = careerStageRef.current
      const track = careerTrackRef.current
      const playhead = playheadRef.current
      if (!stage || !track) return

      // The measure locks in place, then travels sideways. Without a beat between those
      // two motions the direction changes 90° on the same scroll tick, which reads as a
      // lurch. A hold at each end lets the first measure settle before it moves and the
      // last one arrive before the section releases.
      const HOLD_IN = 0.12
      const HOLD_OUT = 0.08
      const TRAVEL = 1 - HOLD_IN - HOLD_OUT

      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth)
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          // Scroll range is grown so the travel portion still maps 1:1 to scroll.
          end: () => `+=${Math.round(distance() / TRAVEL)}`,
          pin: true,
          // Tighter than the opening's cinematic scrub: these panels carry text to read,
          // so they should settle when scrolling stops rather than keep gliding.
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Refresh before the plain reveal triggers so they measure post-pin positions.
          refreshPriority: 1,
        },
      })

      timeline.to(track, { x: () => -distance(), ease: 'none', duration: TRAVEL }, HOLD_IN)
      if (playhead) {
        // Three measures advance in two steps, so the playhead stops on each barline
        // rather than running the full width of the rail.
        const travel = () => ((playhead.parentElement?.clientWidth ?? 0) / career.length) * (career.length - 1)
        timeline.to(playhead, { x: travel, ease: 'none', duration: TRAVEL }, HOLD_IN)
      }
      timeline.set({}, {}, 1)
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

        {/* The brace is the score's way of saying one performer plays every staff below.
            Deloitte governs all three measures, so it opens the movement rather than
            competing with them as a fourth. */}
        <div className="ensemble-brace" data-score-reveal>
          <span className="ensemble-brace__mark" aria-hidden="true" />
          <span className="ensemble-brace__period">2024—Now</span>
          <div className="ensemble-brace__id">
            <p>Deloitte <span>·</span> AI &amp; Engineering</p>
            <span>Consultant</span>
            <h3>One ensemble, three measures.</h3>
          </div>
          <p className="ensemble-brace__note">Since January 2024, every measure below has been performed here—embedded with client teams, carrying the practice in with me.</p>
        </div>

        <div className="career-score">
          <div className="career-stage" ref={careerStageRef}>
            <div className="career-progression" aria-hidden="true">
              <span className="career-progression__line" />
              {career.map((entry, index) => (
                <span
                  className="career-progression__tick"
                  key={`tick-${entry.period}-${entry.team}`}
                  style={{ left: `${(index / career.length) * 100}%` }}
                >
                  <span>{String.fromCharCode(65 + index)} · {entry.period}</span>
                </span>
              ))}
              <span className="career-progression__playhead" ref={playheadRef} />
            </div>

            <div className="career-track" ref={careerTrackRef}>
              {career.map((entry, index) => (
                <article className="career-measure" data-measure-reveal key={`${entry.period}-${entry.team}`}>
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
          </div>
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
          {systems.map(({ number, title, status, copy, beats, principle }) => (
            <article className="system-voice" data-score-reveal key={number}>
              <span className="system-voice__number">{number}</span>
              <div><p className="system-voice__status">{status}</p><h3>{title}</h3></div>
              <div className="system-voice__body">
                <p>{copy}</p>
                {beats.length > 0 && <ul>{beats.map((beat) => <li key={beat}>{beat}</li>)}</ul>}
              </div>
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
              <div className="personal-measure__copy">
                <p>{interest.label}</p><h3>{interest.title}</h3><span>{interest.copy}</span>
                {interest.passage && (
                  <>
                    <PassageToggle
                      id={`${interest.id}-passage`}
                      open={openPassage === interest.id}
                      onToggle={() => setOpenPassage(openPassage === interest.id ? null : interest.id)}
                    />
                    <div className="passage" id={`${interest.id}-passage`} data-open={openPassage === interest.id} role="region" aria-label={`${interest.label}, full passage`}>
                      <div className="passage__inner">
                        <p>{interest.passage.split(/(\*[^*]+\*)/).map((part, i) =>
                          part.startsWith('*') && part.endsWith('*')
                            ? <em key={i}>{part.slice(1, -1)}</em>
                            : part,
                        )}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
