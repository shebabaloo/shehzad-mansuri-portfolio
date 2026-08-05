import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CodaDispersal } from './ui/coda-dispersal'
import { MailLink } from './ui/mail-link'
import { MovementTransition } from './ui/movement-transition'
import { PassageToggle } from './ui/passage-toggle'
import { ARROW_BOTH_WAYS, ARROW_RIGHT, ARROW_UP, ARROW_UP_RIGHT } from '@/lib/glyphs'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const career: { period: string; org: string; team: string; role: string; lead: string; beats: string[]; passage: PassageBlock[] }[] = [
  {
    period: '2025—Now',
    org: 'Deloitte · FAANG company',
    team: 'Infrastructure & Data Centers',
    role: 'Technical Program Manager',
    lead: 'Turning complex infrastructure work into products and programs people can actually operate.',
    beats: [
      'Stood up a cross-functional program and launched its MVP in under three weeks from conception—replacing spreadsheet workflows as the source of truth for a $60B+ investment portfolio.',
      'Compressed the product loop and accelerated team execution with proprietary AI tooling—PRDs, prototypes, user testing, 50+ stakeholder journeys mapped across five programs, and tangible enhancements shipped to production apps.',
      'Owned the roadmap, releases, and documentation for a seven-module financial platform tracking multi-billion-dollar spend, and covered the client program manager through a 90-day absence.',
    ],
    passage: [
      'Six programs in this space over two years. The one I’m on now is a data-center site-selection platform, and it did not exist when I arrived—the portfolio lived in sixteen spreadsheets and no two people read them the same way.',
      'Concept to production took three weeks. That sounds like speed (and it was). But it was really scope discipline: deciding early, and out loud, what the first version would refuse to do. Fast forward a few months: the product has evolved to encompass a broader scope, supplemented by a broader team—now tracking a $60B+ investment portfolio with ~290 monthly active users (and only growing). The original program underneath it was built from zero at the same tempo: a foundation of unique but interconnected workstreams, clear(ish) delivery milestones & owners, and the expectation to move fast and break things.',
      '*Before it, a few more programs:*',
      [
        'A financial platform tracking multi-billion-dollar spend, where I steered the roadmap, the releases, and the documentation—and covered the client program manager through a ninety-day absence.',
        'A seven-page executive dashboard—the VP-level read on how the whole organization was performing. I co-led its rebuild onto a new stack at feature parity, with existing users carried across automatically, then took it over outright when a colleague left ahead of schedule: a seven-workstream roadmap, a 25-editor commentary process, and an access matrix for a 30-person working group.',
        'A business-wide intelligence product, pushed from a quarterly review tool toward a daily insights engine. Its metrics-management table took 80% off engineering reporting support, roughly a third off monthly review prep, and 70% off the clicks it took to manage a metric—and on top of it I helped define the internal AI assistant: dual-agent validation, LLM-powered metric search, analytics-agent integration, and a six-dimension lead-scoring model that reached demo in under two weeks.',
        'Program management stood up from scratch for a data-science team that had neither intake nor a sprint process—43 roadmap projects and 450+ closed tasks later, running on a cadence that finally held.',
      ],
      'What carries across is the practice, not the subject matter: PRDs, prototypes, user testing, and 50+ stakeholder journeys mapped across these programs—closing the distance between a question and something real enough to react to.',
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
      'GenAI products ship fast. Privacy reviews do not. Product teams measure in sprints, legal measures in precedent, and privacy measures in risk that compounds quietly—my job was to make those three clocks readable to each other.',
      'In practice: triaging 140+ releases for pattern, not just for compliance. Noticing where the same question kept coming up across different products, and which fixes could be shared instead of rebuilt every time.',
      'What was important in these briefings wasn’t what happened last week, but where the portfolio was heading—early enough that something could still change.',
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
      'Three kinds of rigor. What I actually learned was to ask before reaching for a template.',
    ],
  },
]

const systems = [
  {
    number: '01', title: 'Second Brain', status: 'Active pattern', diagram: 'ingest' as const,
    copy: [
      'In the chaos before launch there were nine conversations open and no honest way to say which one deserved the next hour. The cost was never finding information. It was rebuilding the context, again, at every switch.',
      'So I built a system to do the rebuilding and hand it back—three agents, thirty-something commands, and scheduled jobs watching every source that matters: chat, AI meeting notes, docs, calendar, tasks. All of it plain markdown on disk, in Obsidian.',
      'Twenty minutes of morning assembly instantly became two. Then, as it scaled, this growing context started doing everything else: the briefs, the follow-ups, the decisions I would otherwise have rebuilt from scratch each time.',
    ],
    principle: `Context ${ARROW_RIGHT} synthesis ${ARROW_RIGHT} next move`,
    passage: [
      'My Second Brain holds project state, the decisions and the reasoning behind them, dependencies, open commitments, and which source is actually the real one.',
      'It preps a meeting by answering what changed and what is still unresolved—not by summarizing the last one. It notices what is coming due, what is blocked, what has quietly stopped moving, and where two workstreams are drifting apart. As cross-workstream dependencies became the priority to watch, it has been instrumental in maintaining our rhythm (ha).',
      'Because it starts from the history of the work instead of a blank prompt, a draft or a risk assessment arrives already grounded. It is files-first underneath—plain text, plain folders, no lock-in—so the thinking outlives whichever tool is fashionable.',
      // ~10 hrs/week supersedes the earlier 8–11 and 5–7 figures, confirmed 2026-08-04.
      'It takes back about ten hours a week, roughly three-quarters of the recurring program overhead. The number I care about more: my team adopted it. Which meant it had to survive contact with people who had not built it.',
    ],
  },
  {
    number: '02', title: 'Team Third Brain', status: 'Active pattern', diagram: 'share' as const,
    copy: [
      'The personal system made me faster. The team still ran on trying to remember meetings, hand-maintained documents, and outdated context.',
      'So the Third Brain is the same idea at team scale: a shared knowledge base everyone reads from, where the verified part of my (and everyone else’s) context gets promoted into common ground—decisions, ownership, milestones, risks.',
      'Agendas, briefings, and weekly updates now stand on that instead of on somebody’s individual memory. The first version served 22 people and routed 90+ sources into a defined structure, keeping 130+ decisions in sync, and it has only grown since.',
    ],
    principle: `Individual context ${ARROW_BOTH_WAYS} shared clarity`,
    passage: [
      'Private context stays private. Only what the team has agreed on is promoted, which is what makes the shared layer trustworthy enough to build on.',
      'It powers meeting agendas, workstream and leadership briefings, weekly updates, onboarding material, and proactive risk signals—and it delivers them on a schedule, into the chats and documents people already work in, so they benefit from it without ever having to operate it themselves.',
      'What it removes is the coordination tax: faster time to context, fewer repeated conversations, earlier risk detection, and handoffs that survive someone leaving.',
      'What I am refining now is the push and the pull: each person’s brain contributes what the rest of the team needs, and pulls back what changed elsewhere. The shared context stays current on its own, instead of waiting for someone to go refresh it.',
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
    copy: 'Millions of tons of specialty crops go unharvested every year. Labor shortages, rising costs, harvest windows that keep narrowing—and the value rots in the field. Groundwork OS was our four-day answer.',
    passage: [
      'The shortage is not machinery. Autonomous harvesters exist and they work. What does not exist is everything a farm would need around them: a way to decide which blocks to run and when, an operator who trusts the fleet enough to leave it running, a financial case that survives a bad season, and a workforce being reorganized around equipment nobody asked for.',
      'So we scoped the platform to that gap rather than to the hardware—a human-machine fleet intelligence layer that advises a deployment, plans the labor around it, and turns one season of field data into a better decision the next.',
      'A concept and an argument, built in four days.',
    ],
    // Shehzad's own public LinkedIn post about SUD '26. Tracking parameters stripped:
    // utm_* are share attribution, and rcm= is a member token tied to his account.
    source: 'https://www.linkedin.com/posts/shehzadmansuri_figured-this-was-a-good-time-to-startup-ugcPost-7456178859080708096-iNgw/',
    sourceLabel: 'Read the post',
  },
  {
    number: 'Variation II', title: 'The Short List', status: 'In the sketchbook',
    icon: 'cup',
    question: 'What if a food guide were simply one person’s taste, stated plainly, instead of a platform waiting on everyone else’s?',
    copy: 'I’m the friend people text for every food, cafe, and life recommendation, and I never took to the ranking apps—a 4.3 is everyone’s opinion, which doesn’t really feel like anybody’s I can vouch for. So this one is just mine! Places I have actually eaten at and keep sending people to, in my order, with the reasons attached. Filter by cuisine, neighborhood, price, or vibe, and watch the list redraw.',
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
  // A second list, where one measure holds two kinds of the same interest.
  listLabel2?: string
  items2?: { name: string }[]
}

/* No passages here, deliberately.
   Every measure used to carry a disclosure, and a disclosure is an invitation to keep
   writing — which is how a section called "Off the clock" ended up with four of five
   passages closing on what the hobby proved about the working day. Games signed off with
   "which is, more or less, what I spend the working day on"; volleyball became a control
   tower. Removing the toggles removes the temptation rather than just this round of its
   output. Depth belongs in Movements II–IV, where a reader actually wants it. */

const interests: Interest[] = [
  {
    id: 'books', mark: 'Aa', label: 'Literature', title: 'Some ideas need more than a tab.',
    copy: 'Fantasy, philosophy, and everything in between. The shelf is subject to change. The passion is not.',
    listLabel: 'Recent favorites',
    items: [
      { name: 'The Way of Kings', by: 'Brandon Sanderson' },
      { name: 'The Myth of Sisyphus', by: 'Albert Camus' },
      { name: 'Spring Snow', by: 'Yukio Mishima' },
      { name: 'Meditations', by: 'Marcus Aurelius' },
    ],
  },
  {
    id: 'games', mark: '◇', label: 'Games', title: 'Worlds, and the people in them.',
    copy: 'Story games where every pause, frame, and soundtrack was somebody’s decision; table games where the rules matter far less than who showed up.',
    listLabel: 'Most memorable on screen',
    items: [
      { name: 'The Last of Us' }, { name: 'Ghost of Tsushima' },
      { name: 'Clair Obscur: Expedition 33' }, { name: 'Destiny 2' },
    ],
    listLabel2: 'Most played around the table',
    items2: [
      { name: 'Catan' }, { name: 'Codenames' },
      { name: 'Rummikub' }, { name: 'Egyptian Rat Slap' },
    ],
  },
  {
    id: 'movement', mark: `${ARROW_UP_RIGHT}`, label: 'Movement', title: 'The score needs a pulse.',
    copy: 'The gym most days, a bike when the weather allows, and volleyball (ideally twelve hours a week). If all else fails, a neighborhood stroll never hurt anyone.',
    listLabel: 'Weekly rotation',
    items: [{ name: 'Volleyball' }, { name: 'Gym' }, { name: 'Cycling' }],
  },
  {
    /* A fermata holds a note longer than it is written. It is the only mark in the notation
       that means "stay here a while", which is the whole argument of this measure. */
    id: 'coffee', mark: '𝄐', label: 'Coffee & company', title: 'Held longer than written.',
    copy: 'Coffee and matcha, in equal measure. The standing excuse to sit across from someone for an hour that was meant to be twenty minutes.',
    listLabel: 'The usual',
    items: [
      { name: 'Coffee' }, { name: 'Matcha' },
      { name: 'Friends & family' }, { name: 'No fixed end time' },
    ],
  },
  {
    id: 'music', mark: '♭', label: 'Music', title: 'Before systems, there were ensembles.',
    copy: 'Seven years of bass clarinet—the line nobody listens for, holding up the ones they do. There is a piano now, which can play either part: the floor or the melody, depending on what the room needs.',
    listLabel: 'What I play',
    items: [{ name: 'Bass clarinet' }, { name: 'Orchestral & jazz' }, { name: 'Piano', by: 'work in progress' }],
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

/* A passage entry is either a paragraph or, when it is an array, a list. Three platforms
   described one after another in prose is the shape that produced a 135-word sentence
   nobody finished; as a list each keeps its own line and its own number, and a reader
   scanning for scale can find it without reading the prose around it. */
export type PassageBlock = string | string[]

function Passage({ id, open, label, paragraphs }: {
  id: string
  open: boolean
  label: string
  paragraphs: PassageBlock[]
}) {
  return (
    <div className="passage" id={id} data-open={open} role="region" aria-label={label}>
      <div className="passage__inner">
        {paragraphs.map((block, i) => Array.isArray(block)
          ? (
            <ul className="passage__list" key={i}>
              {block.map((item, j) => <li key={j}>{renderEmphasis(item)}</li>)}
            </ul>
          )
          : <p key={i}>{renderEmphasis(block)}</p>,
        )}
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
  /* Wide shoulders tapering to a point — a round body read as an apple at 34px. The crown
     is four leaves rather than two hairlines, and three seeds rather than five, because
     below about 40px the fine detail closed up into a smudge. */
  strawberry: (
    <>
      <path d="M5.5 12.3c0-1.7 2.9-3 6.5-3s6.5 1.3 6.5 3c0 4-3.4 9.6-6.5 9.6S5.5 16.3 5.5 12.3Z" />
      <path d="M12 9.3V5.6" />
      <path d="M12 9.1C10.6 7.7 8.6 7 6.5 7.2" />
      <path d="M12 9.1c1.4-1.4 3.4-2.1 5.5-1.9" />
      <path d="M12 8.6c-.7-1.5-1.9-2.6-3.4-3.1" />
      <path d="M12 8.6c.7-1.5 1.9-2.6 3.4-3.1" />
      <path d="M9.5 14.1v1.3M14.5 14.1v1.3M12 17.4v1.3" />
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

/* The two systems are architectures, and an architecture is faster to see than to read.
   These are not illustration: the first is the funnel the prose describes — many sources
   converging on one node, one considered move leaving it — and the second is the push and
   pull, each brain writing into shared ground and drawing back what changed. Same stroke
   vocabulary as the variation marks, so they read as notation rather than infographic.
   Labelled for screen readers, since they carry meaning rather than decorate. */
const systemDiagrams = {
  ingest: {
    label: 'Many sources converging on one system, which returns a single next move',
    art: (
      <>
        {[16, 38, 60, 82, 104, 126].map((y) => (
          <g key={y}>
            <circle cx="14" cy={y} r="2.5" />
            <path d={`M19 ${y}L84 70`} />
          </g>
        ))}
        <g className="system-diagram__focus">
          <circle cx="100" cy="70" r="15" />
          <circle cx="100" cy="70" r="3.5" />
          <path d="M115 70h56" />
          <path d="M165 64.5l6.5 5.5-6.5 5.5" />
        </g>
      </>
    ),
  },
  share: {
    label:
      'Several brains pushing into and pulling from one shared team context, which in turn '
      + 'delivers on a schedule into the chats, documents and inboxes people already work in',
    art: (
      <>
        {[40, 100, 160].map((x) => (
          <g key={x}>
            <circle cx={x} cy="20" r="10" />
            <circle cx={x} cy="20" r="2.5" />
            {/* push: down into shared ground */}
            <path d={`M${x - 5} 32v40`} />
            <path d={`M${x - 8.5} 67l3.5 5 3.5-5`} />
            {/* pull: back up, carrying what changed elsewhere */}
            <path d={`M${x + 5} 72V32`} />
            <path d={`M${x + 1.5} 37l3.5-5 3.5 5`} />
          </g>
        ))}
        <g className="system-diagram__focus">
          <rect x="18" y="76" width="164" height="24" rx="3" />
          <path d="M30 88h28M86 88h28M142 88h20" />
          {/* and out again: the shared ground delivers rather than merely storing */}
          <path d="M100 100v16" />
          <path d="M100 116L48 138M100 116v22M100 116l52 22" />
          <path d="M52.1 132.4L48 138l6.9.9" />
          <path d="M96.5 132.5L100 138l3.5-5.5" />
          <path d="M147.9 132.4L152 138l-6.9.9" />
        </g>
        {/* the places the work actually lands */}
        <rect x="35" y="138" width="26" height="13" rx="2" />
        <rect x="87" y="138" width="26" height="13" rx="2" />
        <rect x="139" y="138" width="26" height="13" rx="2" />
      </>
    ),
  },
}

function SystemDiagram({ kind }: { kind: keyof typeof systemDiagrams }) {
  const { label, art } = systemDiagrams[kind]
  return (
    <svg className="system-diagram" viewBox={kind === 'share' ? '0 0 200 158' : '0 0 200 140'} role="img" aria-label={label}>
      {art}
    </svg>
  )
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
          {systems.map(({ number, title, status, copy, principle, passage, diagram }) => (
            <article className="system-voice" data-score-reveal key={number}>
              <span className="system-voice__number">{number}</span>
              <div>
                <p className="system-voice__status">{status}</p><h3>{title}</h3>
                <SystemDiagram kind={diagram} />
              </div>
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
          {/* Two beats rather than one. The first is the argument — hallucination as a
              property to engineer around rather than a defect to patch, and the compounding
              that makes it worse in a system that reads its own output. The second is what
              was actually built, and the number that makes it a measurement instead of a
              claim. Splitting them lets the first land before the second starts listing. */}
          <p className="counterpoint__check" data-score-reveal>
            Hallucination is not a defect you patch out. It is what these systems do when
            they have plenty of context and nothing anchoring it, and they do it with perfect
            composure. The harder problem is the second order: a system that reads its own
            output will eventually read its own mistakes. One stale fact does not stay one
            fact — it gets summarised, carried forward, and comes back wearing more
            confidence than it left with.
          </p>
          <p className="counterpoint__check" data-score-reveal>
            So most of what I built is refusal. Intake is gated. Every claim traces to a
            specific signal and is cross-verified across sources, weighted toward the ones
            with the authority to be right. What survives is reconciled against the record,
            and anything stale is marked stale rather than quietly kept. The thresholds came
            out of an eval set rather than a guess: roughly 14% of the action items it
            drafted were fabricated, and the checks started catching them before they became
            actionable work.
          </p>
          <p className="counterpoint__check counterpoint__check--close" data-score-reveal>
            <em>I built it, and then I refused to trust it.</em>
          </p>
          <span className="counterpoint__chord" aria-hidden="true"><i /><i /><i /></span>
        </div>
      </section>

      <MovementTransition />

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
                    {variation.sourceLabel} <span aria-hidden="true">{ARROW_UP_RIGHT}</span>
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
                {interest.listLabel2 && interest.items2 && (
                  <>
                    <p className="personal-measure__list-label personal-measure__list-label--second">
                      {interest.listLabel2}
                    </p>
                    <ul>{interest.items2.map((item) => <li key={item.name}>{item.name}</li>)}</ul>
                  </>
                )}
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
          <p>If any of this sounds like a conversation worth having, say hello!</p>
          <p className="coda__honest">What I have not done yet is carry a product alone: the deciding, the saying no, the long argument with what users actually need rather than what they asked for. I have been the second voice in that room for two years. The first is what I am building toward.</p>
          {/* The sign-off shares the nav's row rather than sitting a screen below it. It is
              the same gesture a score uses: the composer's name sits on the final system,
              not on a page of its own. Collapsing the two rows is also what lets the whole
              Coda — label through signature — frame in a single viewport. */}
          <div className="coda__close">
            <nav aria-label="Contact and resume links">
              <MailLink>Email <span>{ARROW_UP_RIGHT}</span></MailLink>
              <a href="https://www.linkedin.com/in/shehzadmansuri/" target="_blank" rel="noreferrer">LinkedIn <span>{ARROW_UP_RIGHT}</span></a>
              <a href="#first-movement">Return to the score <span>{ARROW_UP}</span></a>
            </nav>
            <strong>— Shez<span>.</span></strong>
          </div>
        </div>
      </section>
    </div>
  )
}
