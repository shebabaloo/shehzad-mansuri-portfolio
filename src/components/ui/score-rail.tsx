import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type ScoreRailHandle = {
  setProgress: (progress: number) => void
  setVisible: (visible: number) => void
}

const chapters = [
  { id: 'overture', short: 'P', label: 'Prelude' },
  { id: 'first-movement', short: 'I', label: 'Meet Shez' },
  { id: 'work', short: 'II', label: 'Work in motion' },
  { id: 'systems', short: 'III', label: 'Nobody assigned these' },
  { id: 'off-clock', short: 'IV', label: 'Off the clock' },
  { id: 'coda', short: 'V', label: 'Coda' },
]

const notation = [
  { at: 8, line: 1, kind: 'ring' }, { at: 13, line: 3, kind: 'note' },
  { at: 20, line: 0, kind: 'bar' }, { at: 27, line: 4, kind: 'ring' },
  { at: 34, line: 2, kind: 'note' }, { at: 41, line: 1, kind: 'bar' },
  { at: 49, line: 4, kind: 'note' }, { at: 57, line: 0, kind: 'ring' },
  { at: 64, line: 3, kind: 'bar' }, { at: 72, line: 2, kind: 'ring' },
  { at: 80, line: 4, kind: 'note' }, { at: 88, line: 1, kind: 'bar' },
]

export const ScoreRail = forwardRef<ScoreRailHandle>(function ScoreRail(_, ref) {
  const railRef = useRef<HTMLElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const chapterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    const updateChapter = () => {
      let activeChapter = chapters[0]
      for (const chapter of chapters) {
        const element = document.getElementById(chapter.id)
        const documentTop = element ? element.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY
        if (window.scrollY + window.innerHeight * 0.42 >= documentTop) activeChapter = chapter
      }
      if (chapterRef.current) chapterRef.current.textContent = activeChapter.short
      if (thumbRef.current) thumbRef.current.dataset.movement = activeChapter.label
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateChapter)
    }
    updateChapter()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    setProgress(progress) {
      const value = Math.min(1, Math.max(0, progress))
      railRef.current?.style.setProperty('--page-progress', value.toFixed(4))
      railRef.current?.setAttribute('aria-valuenow', String(Math.round(value * 100)))
    },
    setVisible(visible) {
      railRef.current?.style.setProperty('--rail-opacity', visible.toFixed(4))
    },
  }), [])

  return (
    <nav
      ref={railRef}
      className="score-rail"
      aria-label="Score progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span ref={chapterRef} className="score-rail__chapter" aria-hidden="true">P</span>
      <span className="score-rail__staff" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
      </span>
      <span className="score-rail__notation" aria-hidden="true">
        {notation.map((mark, index) => (
          <i
            key={`${mark.at}-${index}`}
            className={`score-rail__mark score-rail__mark--${mark.kind}`}
            style={{ '--mark-at': `${mark.at}%`, '--mark-line': mark.line } as React.CSSProperties}
          />
        ))}
      </span>
      <span ref={thumbRef} className="score-rail__thumb" aria-hidden="true" />
      <span className="score-rail__links">
        {chapters.map((chapter, index) => (
          <a key={chapter.id} href={`#${chapter.id}`} aria-label={`Go to ${chapter.label}`} style={{ '--chapter-position': index / (chapters.length - 1) } as React.CSSProperties}>
            <span>{chapter.short}</span>
          </a>
        ))}
      </span>
    </nav>
  )
})
