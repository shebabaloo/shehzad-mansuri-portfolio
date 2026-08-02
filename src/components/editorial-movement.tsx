export function EditorialMovement() {
  return (
    <section className="first-movement" id="first-movement" aria-labelledby="living-score-title">
      <svg className="paper-score" viewBox="0 0 1200 190" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55C300 55 360 85 600 85S940 55 1200 55" />
        <path d="M0 72C300 72 360 88 600 88S940 72 1200 72" />
        <path d="M0 89H1200" />
        <path d="M0 106C300 106 360 90 600 90S940 106 1200 106" />
        <path d="M0 123C300 123 360 92 600 92S940 123 1200 123" />
      </svg>

      <div className="editorial-shell">
        <aside className="folio" aria-label="Movement information">
          <p>Movement I</p>
          <span>Meet Shez</span>
        </aside>

        <article className="landing-copy">
          <p className="eyebrow">The Living Score</p>
          <h2 id="living-score-title">A life in<br /><em>progress.</em></h2>
          {/* The dek used to stop at temperament — three descriptors and no facts. A reader
              meeting this section first had no idea what the work actually is, so the
              second sentence lands the role before the abstraction starts. */}
          <p className="dek">
            I’m Shez—part product thinker, part systems builder, and always curious
            about what happens when an idea gets room to move. Day to day, a technical
            program manager at Deloitte, embedded within FAANG data-center
            infrastructure teams.
          </p>
          <p className="body-copy">
            Most of what I do happens in the space between things—between a team that has
            decided something and a team that has not yet heard it, between what a system
            can be told and what it can be trusted to say. The work I keep returning to is
            the layer underneath: consolidating what is scattered, naming which source is
            actually authoritative, carrying context across a gap it would not otherwise
            cross. It is quieter than the work that sits on top of it, and it is the part I
            want to keep doing—increasingly as product, where the question stops being what
            is already owed and becomes what should exist at all.
          </p>
          <div className="landing-actions">
            <a className="text-link" href="#score-index">Read the score <span>↓</span></a>
            {/* Prefixed with BASE_URL rather than written from the root. Files in public/
                are copied verbatim and their URLs are not rewritten, so a literal
                "/shehzad-mansuri-cv.pdf" resolves to the domain root and 404s wherever the
                site is served from a subpath — which is exactly where it went live.
                BASE_URL carries its own trailing slash and is "/" at the root. */}
            <a className="text-link" href={`${import.meta.env.BASE_URL}shehzad-mansuri-cv.pdf`} target="_blank" rel="noreferrer">Take the score <span>↗</span></a>
            <a className="text-link text-link--quiet" href="#coda">Say hello <span>↓</span></a>
          </div>
        </article>

        <nav className="score-index" id="score-index" aria-label="Score movements">
          <p>In this score</p>
          <ol>
            <li><a href="#work"><b>02</b> Work in motion</a></li>
            <li><a href="#systems"><b>03</b> Systems that compound</a></li>
            <li><a href="#experiments"><b>04</b> Ideas worth a first form</a></li>
            <li><a href="#off-clock"><b>05</b> Off the clock</a></li>
          </ol>
        </nav>
      </div>
    </section>
  )
}
