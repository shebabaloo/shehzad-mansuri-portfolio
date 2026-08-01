export function OriginBook() {
  return (
    <div className="origin-book" aria-hidden="true">
      <span className="origin-book__closed">
        <i />
      </span>
      <span className="origin-book__shadow" />
      <span className="origin-book__cover origin-book__cover--left" />
      <span className="origin-book__cover origin-book__cover--right" />
      <span className="origin-book__page origin-book__page--left">
        <i /><i /><i />
      </span>
      <span className="origin-book__page origin-book__page--right">
        <i /><i /><i />
      </span>
      <span className="origin-book__spine" />
    </div>
  )
}
