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
          <p className="dek">
            I’m Shez—part product thinker, part systems builder, and always curious
            about what happens when an idea gets room to move.
          </p>
          <p className="body-copy">
            This is where the professional and personal share a staff: work at Deloitte,
            AI-native systems, experiments still taking shape, and the books, games,
            music, and movement that keep the whole thing human.
          </p>
          <div className="landing-actions">
            <a className="text-link" href="#score-index">Read the score <span>↓</span></a>
            <a className="text-link text-link--quiet" href="mailto:shehzadm7861@gmail.com">Say hello <span>↗</span></a>
          </div>
        </article>

        <nav className="score-index" id="score-index" aria-label="Score movements">
          <p>In this score</p>
          <ol>
            <li><a href="#work"><b>02</b> Work in motion</a></li>
            <li><a href="#systems"><b>03</b> Systems that compound</a></li>
            <li><a href="#experiments"><b>04</b> Variations</a></li>
            <li><a href="#off-clock"><b>05</b> Off the clock</a></li>
          </ol>
        </nav>
      </div>
    </section>
  )
}
