import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CodaDispersal } from './ui/coda-dispersal'
import { MailLink } from './ui/mail-link'
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
      'Stood up a cross-functional program and launched its MVP in under three weeks from conception—replacing spreadsheet workflows as the source of truth for a $60B+ investment portfolio.',
      'Compressed the product loop and accelerated team execution with proprietary AI tooling—PRDs, 50+ stakeholder journeys, prototypes, user testing, and tangible enhancements shipped to production apps.',
      'Owned the roadmap, releases, and documentation for a seven-module financial platform tracking $20B+ in spend, and covered the client program manager through a 90-day absence.',
    ],
    passage: [
      'I have supported six programs in this space over two years. The one I am on now is a data-center site-selection platform, and it did not exist when I arrived: the portfolio lived in sixteen spreadsheets, and no two people read them the same way.',
      'Concept to production took three weeks, which sounds like speed and was really scope discipline: deciding early, and out loud, what the first version would refuse to do. It now carries a $60B+ investment portfolio and peaks near 290 monthly users. The program underneath it was built from zero on the same clock—four parallel workstreams, twelve milestones across three delivery phases, an access-control matrix, and a decision log separating MVP from V1.',
      'Before it came three more platforms: a seven-module financial platform tracking $20B+ in spend, where I owned the roadmap, the releases, and the documentation and covered the client program manager through a ninety-day absence; a seven-page executive dashboard rebuilt on a new stack at feature parity, its existing users migrated across automatically; and a business-wide intelligence and metrics product, where I drove metrics management and a single table cut engineering reporting support by 80% while taking roughly a third off the monthly review prep. Alongside them I stood up program management for a data-science team that had neither intake nor sprint process—43 roadmap projects and 450+ closed tasks later, it was running on a cadence that finally held.',
      'What carries across all of them is the practice rather than the subject matter. I use proprietary AI tooling to author PRDs, map 50+ stakeholder journeys, stand up prototypes, and run user testing—compressing the distance between a question and something real enough to react to.',
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
    passage: [
      'GenAI products ship fast and privacy reviews do not. The tension is structural: product teams measure in sprints, legal measures in precedent, and privacy measures in risk that compounds quietly. My job was to make those three clocks legible to each other.',
      'In practice that meant triaging 140+ releases for pattern rather than only for compliance—noticing where the same question kept surfacing across different products, and which mitigations could be shared instead of rebuilt each time.',
      'The briefings were not status updates. They were trend synthesis: turning individual review outcomes into a picture of where the portfolio was heading, early enough that something could still change.',
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
    passage: [
      'Three industries in twelve months, and the hardest part was never the framework. It was working out which questions matter in a domain you are still learning.',
      'In cybersecurity the question was sizing—where a $10M+ opportunity actually sits across customer-partner and outcomes programs. In entertainment it was execution: carrying a $2M ERP MVP through user stories, a RAID log, and the status reporting that keeps a build honest. In healthcare it was compliance—documenting supplier scope for a Medicare divestiture without breaking the regulatory chain.',
      'Each asked for a different kind of rigor. The through-line was learning to ask before reaching for a template.',
    ],
  },
]

const systems = [
  {
    number: '01', title: 'Second Brain', status: 'Active pattern',
    copy: [
      'By the middle of the day there were nine conversations open and no honest way to say which one deserved the next hour. The cost was never finding information. It was the reconstruction, performed again at every switch.',
      'So I built a program-management system that does the reconstruction and hands it back: three agents, twenty-two commands, and scheduled jobs watching thirty-odd sources—chat, docs, calendar, tasks—all of it plain files on disk.',
      'Twenty minutes of morning assembly became two. Then the same context started doing the rest: the briefs, the follow-ups, the decisions I would otherwise have rebuilt from scratch each time.',
    ],
    principle: 'Context → synthesis → next move',
    passage: [
      'It holds project state, decisions and the reasoning behind them, dependencies, open commitments, and which source is actually authoritative.',
      'It prepares a meeting by answering what changed and what is still unresolved, rather than summarizing the last one. It notices what is approaching a deadline, what is blocked, what has quietly stopped moving, and where two workstreams are drifting apart.',
      'Because it starts from the history of the work instead of a blank prompt, a draft or a risk assessment arrives already grounded. It is files-first underneath—plain text, plain folders, no lock-in—so the thinking outlives whichever tool is fashionable.',
      'In practice it takes back eight to eleven hours a week, roughly three-quarters of the recurring program overhead. The number I care about more is that it was adopted across my team rather than staying a personal trick—which meant it had to survive contact with people who had not built it.',
    ],
  },
  {
    number: '02', title: 'Team Third Brain', status: 'Active pattern',
    copy: [
      'The personal system made me faster. The team still ran on meetings and hand-maintained documents.',
      'So the Third Brain is the same architecture at team scope: a shared knowledge base the whole group reads from, where the verified, team-relevant part of my context is promoted into common ground—decisions, ownership, milestones, risks.',
      'Agendas, briefings, and weekly updates now stand on that rather than on anyone’s memory. The first implementation serves 22 members across 90+ resources and 130+ synchronized decisions.',
    ],
    principle: 'Individual context ↔ shared clarity',
    passage: [
      'Private context stays private. Only what the team has agreed on is promoted, which is what makes the shared layer trustworthy enough to build on.',
      'It powers meeting agendas, workstream and leadership briefings, weekly updates, onboarding material, and proactive risk signals—so people benefit from it without having to operate it themselves.',
      'What it removes is the coordination tax: faster time to context, fewer repeated conversations, earlier risk detection, and handoffs that survive someone leaving.',
      'What I am building now is the push and the pull. Each person’s brain contributes what the rest of the team needs to know, and draws back what has changed elsewhere—so the shared context stays current and aware of itself, rather than waiting for someone to go collect it.',
    ],
  },
]

type Variation = {
  number: string
  title: string
  status: string
  icon: 'strawberry' | 'cup' | 'plane'
  question: string
  copy: string
  passage?: string[]
  source?: string
  sourceLabel?: string
}

const variations: Variation[] = [
  {
    number: 'Variation I', title: 'Groundwork OS', status: 'StartUp Deloitte ’26',
    icon: 'strawberry',
    question: 'What has to exist around autonomous machinery before a farm can actually use it?',
    copy: 'Millions of tons of specialty crops go unharvested every year—labor shortages, rising costs, and harvest windows that keep narrowing—and the value rots in the field. Groundwork OS was our four-day answer.',
    passage: [
      'The shortage is not machinery. Autonomous harvesters exist and they work. What does not exist is everything a farm would need around them: a way to decide which blocks to run and when, an operator who trusts the fleet enough to leave it running, a financial case that survives a bad season, and a workforce being reorganized around equipment nobody asked for.',
      'So we scoped the platform to that gap rather than to the hardware—a human-machine fleet intelligence layer that advises a deployment, plans the labor around it, and turns one season of field data into a better decision the next.',
      'A concept and an argument, built in a week that did not have one.',
    ],
    // Shehzad's own public LinkedIn post about SUD '26. Tracking parameters stripped:
    // utm_* are share attribution, and rcm= is a member token tied to his account.
    source: 'https://www.linkedin.com/posts/shehzadmansuri_figured-this-was-a-good-time-to-startup-ugcPost-7456178859080708096-iNgw/',
    sourceLabel: 'Read the post',
  },
  {
    number: 'Variation II', title: 'The Short List', status: 'In the sketchbook',
    icon: 'cup',
    question: 'What if a recommendation still carried the person who made it, instead of an average of strangers?',
    copy: 'I never took to the food-ranking apps: the number at the top is everyone’s opinion, and therefore nobody’s. This is the opposite—the places I have actually saved and the advice I keep texting, ordered by my own taste. And something you move through rather than scroll: filter by cuisine, neighborhood, price, or vibe and watch the shortlist redraw itself.',
  },
  {
    number: 'Variation III', title: 'One-File Flight', status: 'In the sketchbook',
    icon: 'plane',
    question: 'How much world can you fit inside a single HTML file?',
    copy: 'A flight simulator with no build step and no dependencies—terrain generated procedurally at load, flown in the browser, and passed around as one file that still works in ten years.',
  },
]

type Interest = {
  id: string
  mark: string
  label: string
  title: string
  copy: string
  listLabel: string
  // `by` is the byline, carried only where attribution is the point — books have authors,
  // volleyball does not. Without the annotation TypeScript infers a union per entry and
  // the optional property becomes unreachable.
  items: { name: string; by?: string }[]
  passage: string[]
}

const interests: Interest[] = [
  {
    id: 'books', mark: 'Aa', label: 'Books & philosophy', title: 'Some ideas need more than a tab.',
    copy: 'Fantasy for invention, philosophy for friction, and literary fiction for the things neither one will say directly.',
    listLabel: 'Recent favorites',
    items: [
      { name: 'The Way of Kings', by: 'Brandon Sanderson' },
      { name: 'The Myth of Sisyphus', by: 'Albert Camus' },
      { name: 'Spring Snow', by: 'Yukio Mishima' },
      { name: 'Meditations', by: 'Marcus Aurelius' },
    ],
    passage: [
      'My college application essay was about a bookstore—about walking in with no title in mind and waiting to be caught by one. I still choose books that way. The shelf has changed somewhat.',
      'What I look for now is a way of thinking I have not met yet. *Meditations* and *The Myth of Sisyphus* argue directly about how to hold a life. *Spring Snow* refuses to argue and simply shows you one. *The Way of Kings* invents an entire world in order to ask the same question somewhere the answer is not already settled.',
      'Each one is another point of view, another gap quietly closed. In this world, I seek to learn.',
    ],
  },
  {
    id: 'games', mark: '◇', label: 'Games', title: 'Worlds that stay after the credits.',
    copy: 'What they share is authorship—somebody chose the color of that field, the length of that silence. The same taste that produced the site you are scrolling, pointed at a different medium.',
    listLabel: 'Most memorable video games',
    items: [
      { name: 'The Last of Us' }, { name: 'Ghost of Tsushima' },
      { name: 'Clair Obscur: Expedition 33' },
      { name: 'Final Fantasy VII' }, { name: 'Destiny 2' },
    ],
    passage: [
      'Somebody chose the exact moment control is taken away from you, and the exact moment it is handed back.',
      'I play them the way I read a building: as design objects, outputs of imagination that someone had to argue for before anyone could stand inside them. Story-rich worlds, difficult choices, and the strange intimacy of learning a place by moving through it.',
      'Destiny 2 has been the outlier for the last decade—a world I return to rather than finish, where the pull is the loop and the people running it with me.',
    ],
  },
  {
    id: 'movement', mark: '↗', label: 'Movement', title: 'The score needs a pulse.',
    copy: 'The gym most days, a bike when the weather allows, and volleyball twelve hours a week, ideally across three sessions.',
    listLabel: 'Weekly rotation',
    items: [{ name: 'Volleyball' }, { name: 'Gym' }, { name: 'Cycling' }],
    passage: [
      'On the court I set. The setter takes the second touch and is almost never the one who scores: you read the court mid-air, decide whose play this is, and put the ball exactly where their best swing already lives. A control tower—define the play, then get out of its way.',
      'What brings me back is not the point. It is the moment someone starts arriving where I put the ball before I have finished putting it there.',
    ],
  },
  {
    id: 'music', mark: '♭', label: 'Music', title: 'Before systems, there were ensembles.',
    copy: 'Seven years of bass clarinet—the line nobody listens for, holding up the ones they do. There is a piano now, which plays either part: the floor or the melody, depending on what the room needs.',
    listLabel: 'What I play',
    items: [{ name: 'Bass clarinet' }, { name: 'Orchestral & jazz' }, { name: 'Piano' }],
    passage: [
      'The bass clarinet is a long, bottom-heavy, faintly absurd mix between a clarinet and a saxophone, and nobody in an audience is listening for it. That is more or less the point of it. It lays the floor; the flutes and the clarinets come in above, and what a listener actually hears is not the low line but a fullness they cannot locate.',
      'What I remember is not any performance. It is the rehearsals—working out where everyone’s strength sat and what they needed underneath them. Time passed. The interest never went anywhere.',
    ],
  },
]

/* Ids reach the DOM from display strings like "Variation I", and an id may not contain
   whitespace — an invalid id silently breaks the aria-controls link between a toggle and
   the region it opens, which is exactly the wiring a screen reader depends on. */
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/* Passages are authored as arrays of paragraphs rather than one block: these are arguments
   in stages, and a reader who opens a disclosure should be able to see the stages. Titles
   are marked with *asterisks* in the source and set in italic here. */
const renderEmphasis = (text: string) =>
  text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <em key={i}>{part.slice(1, -1)}</em>
      : part,
  )

function Passage({ id, open, label, paragraphs }: {
  id: string
  open: boolean
  label: string
  paragraphs: string[]
}) {
  return (
    <div className="passage" id={id} data-open={open} role="region" aria-label={label}>
      <div className="passage__inner">
        {paragraphs.map((paragraph, i) => <p key={i}>{renderEmphasis(paragraph)}</p>)}
      </div>
    </div>
  )
}

/* Each variation gets a mark, because three headings in the same display face read as one
   undifferentiated block until something tells them apart. Drawn rather than set: emoji or
   stock glyphs would land as clip art next to this typography, and DESIGN.md rules that
   out. These use the monogram's vocabulary instead — one weight of stroke, round joins,
   no fill — so they read as notation on the same page rather than borrowed iconography. */
const variationMarks = {
  strawberry: (
    <>
      <path d="M12 21.4c-3.9 0-6.9-3.3-6.9-7.2 0-2.7 2.1-4.8 3.9-4.8 1 0 2 .4 3 .4s2-.4 3-.4c1.8 0 3.9 2.1 3.9 4.8 0 3.9-3 7.2-6.9 7.2Z" />
      <path d="M12 9.4V5.9" />
      <path d="M12 7.2C11 6.1 9.6 5.6 8.2 5.8" />
      <path d="M12 7.2c1-1.1 2.4-1.6 3.8-1.4" />
      <path d="M9.7 13.3v.7M14.3 13.3v.7M12 16v.7M10.3 18.2v.7M13.7 18.2v.7" />
    </>
  ),
  cup: (
    <>
      <path d="M5.4 10.4h11.2v4.3a5.6 5.6 0 0 1-11.2 0Z" />
      <path d="M16.6 11.7h1.7a2.1 2.1 0 0 1 0 4.2h-1.7" />
      <path d="M3.4 20.4h15.2" />
      <path d="M9.5 7.6c0-1.1 1-1.6 1-2.7s-1-1.6-1-1.6" />
      <path d="M13.5 7.6c0-1.1 1-1.6 1-2.7s-1-1.6-1-1.6" />
    </>
  ),
  plane: (
    <path d="M12 2.6c.75 0 1.3.85 1.3 1.9v4.4l7.2 4.2v1.9l-7.2-2.2v4.4l2.1 1.5v1.4L12 19.4l-3.4.7v-1.4l2.1-1.5v-4.4L3.5 15v-1.9l7.2-4.2V4.5c0-1.05.55-1.9 1.3-1.9Z" />
  ),
}

function VariationMark({ icon }: { icon: keyof typeof variationMarks }) {
  return (
    <svg className="variation__icon" viewBox="0 0 24 24" aria-hidden="true">
      {variationMarks[icon]}
    </svg>
  )
}

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
                  {/* Letter only. Each measure's own rehearsal mark already carries the
                      period directly beneath it, and printing both put the same string on
                      screen twice while B and C floated over the measure being read. */}
                  <span>{String.fromCharCode(65 + index)}</span>
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

        <div className="career-passages" data-score-reveal>
          {career.map((entry, index) => (
            <div className="career-passage-card" key={`passage-${entry.period}-${entry.team}`}>
              <div className="career-passage-card__header">
                <span className="career-passage-card__mark">{String.fromCharCode(65 + index)}</span>
                <div>
                  <p>{entry.role}</p>
                  <span>{entry.team}</span>
                </div>
              </div>
              <PassageToggle
                id={`career-${String.fromCharCode(65 + index)}-passage`}
                open={openPassage === `career-${index}`}
                onToggle={() => setOpenPassage(openPassage === `career-${index}` ? null : `career-${index}`)}
                label="Read the full measure"
                openLabel="Close the measure"
              />
              <Passage
                id={`career-${String.fromCharCode(65 + index)}-passage`}
                open={openPassage === `career-${index}`}
                label={`${entry.role}, full passage`}
                paragraphs={entry.passage}
              />
            </div>
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
          {systems.map(({ number, title, status, copy, principle, passage }) => (
            <article className="system-voice" data-score-reveal key={number}>
              <span className="system-voice__number">{number}</span>
              <div><p className="system-voice__status">{status}</p><h3>{title}</h3></div>
              <div className="system-voice__body">
                {copy.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                <PassageToggle
                  id={`system-${number}-passage`}
                  open={openPassage === `system-${number}`}
                  onToggle={() => setOpenPassage(openPassage === `system-${number}` ? null : `system-${number}`)}
                  label="Read the mechanics"
                  openLabel="Close the mechanics"
                />
                <Passage
                  id={`system-${number}-passage`}
                  open={openPassage === `system-${number}`}
                  label={`${title}, mechanics`}
                  paragraphs={passage}
                />
              </div>
              <strong>{principle}</strong>
            </article>
          ))}
          <p className="counterpoint__check" data-score-reveal>
            Given enough context and too few guardrails, these systems will state something
            false with perfect composure. The work I care about most was the checks: every
            output cross-verified against multiple sources, every closure traceable to a
            specific signal, everything stale flagged as stale. <em>I built it, and then I
            refused to trust it.</em>
          </p>
          <span className="counterpoint__chord" aria-hidden="true"><i /><i /><i /></span>
        </div>
      </section>

      <section className="score-section variations-movement" id="experiments" aria-labelledby="variations-title">
        <header className="movement-heading movement-heading--compact" data-score-reveal>
          <p>Movement IV <span>·</span> Variations</p>
          <h2 id="variations-title">Ideas worth giving a <em>first playable form.</em></h2>
          <p className="movement-intro">Things nobody assigned—one taken as far as a pitch, the rest still questions I would like to test by making something small and real.</p>
        </header>
        <div className="variation-score">
          {variations.map((variation) => (
            <article className="variation" data-score-reveal key={variation.title}>
              <div className="variation__meta">
                <VariationMark icon={variation.icon} />
                <span>{variation.number}</span><b>{variation.status}</b>
              </div>
              <div>
                <h3>{variation.title}</h3>
                <p className="variation__question">{variation.question}</p>
                {variation.source && (
                  <a className="variation__source" href={variation.source} target="_blank" rel="noreferrer">
                    {variation.sourceLabel} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              <div>
                <p className="variation__copy">{variation.copy}</p>
                {variation.passage && (
                  <>
                    <PassageToggle
                      id={`${slug(variation.number)}-passage`}
                      open={openPassage === variation.number}
                      onToggle={() => setOpenPassage(openPassage === variation.number ? null : variation.number)}
                    />
                    <Passage
                      id={`${slug(variation.number)}-passage`}
                      open={openPassage === variation.number}
                      label={`${variation.title}, full passage`}
                      paragraphs={variation.passage}
                    />
                  </>
                )}
              </div>
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
                    <Passage
                      id={`${interest.id}-passage`}
                      open={openPassage === interest.id}
                      label={`${interest.label}, full passage`}
                      paragraphs={interest.passage}
                    />
                  </>
                )}
              </div>
              {/* The list used to stand unlabelled, which left the reader to infer what
                  four proper nouns had in common. Naming it is the cheaper fix. */}
              <div className="personal-measure__list">
                <p className="personal-measure__list-label">{interest.listLabel}</p>
                <ul>{interest.items.map((item) => (
                  <li key={item.name}>
                    {item.name}
                    {item.by && <span>{item.by}</span>}
                  </li>
                ))}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="coda" id="coda" aria-labelledby="coda-title">
        <SectionStaff />
        <CodaDispersal />
        <div className="coda__inner" data-score-reveal>
          <p>Coda <span>·</span> Still composing</p>
          <h2 id="coda-title">The next movement is <em>still unwritten.</em></h2>
          <p>If any of this sounds like a conversation worth having, say hello.</p>
          <p className="coda__honest">What I have not done yet is carry a product alone: the deciding, the saying no, the long argument with what users actually need rather than what they asked for. I have been the second voice in that room for two years; the first is what I am building toward.</p>
          {/* The sign-off shares the nav's row rather than sitting a screen below it. It is
              the same gesture a score uses: the composer's name sits on the final system,
              not on a page of its own. Collapsing the two rows is also what lets the whole
              Coda — label through signature — frame in a single viewport. */}
          <div className="coda__close">
            <nav aria-label="Contact and resume links">
              <MailLink>Email <span>↗</span></MailLink>
              <a href="https://www.linkedin.com/in/shehzadmansuri/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
              <a href="#first-movement">Return to the score <span>↑</span></a>
            </nav>
            <strong>— Shez<span>.</span></strong>
          </div>
        </div>
      </section>
    </div>
  )
}
