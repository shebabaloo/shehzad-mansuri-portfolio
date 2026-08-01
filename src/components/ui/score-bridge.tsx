export function ScoreBridge() {
  const leftPaths = [224, 242, 260, 278, 296]
  const rightPaths = [224, 242, 260, 278, 296]

  return (
    <svg
      className="score-bridge"
      viewBox="0 0 1440 520"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="score-bridge__staff score-bridge__left">
        {leftPaths.map((y, index) => (
          <path key={y} d={`M720 ${y}C560 ${y} 350 ${176 + index * 18} 0 ${270 + index * 18}`} />
        ))}
      </g>
      <g className="score-bridge__staff score-bridge__right">
        {rightPaths.map((y, index) => (
          <path key={y} d={`M720 ${y}C880 ${y} 1090 ${176 + index * 18} 1440 ${270 + index * 18}`} />
        ))}
      </g>
      <g className="score-bridge__staff score-bridge__dock">
        {rightPaths.map((y, index) => {
          const railX = 1424 + index * 3
          return <path key={y} d={`M720 ${y}C960 ${y} 1200 ${y} 1338 ${y}C1392 ${y} ${railX} 238 ${railX} 274L${railX} 520`} />
        })}
      </g>
      <g className="score-bridge__staff score-bridge__flip">
        {rightPaths.map((y, index) => (
          <path key={y} d={`M80 ${y}C420 ${y - 5} 920 ${y + 5} 1360 ${y}`} />
        ))}
      </g>
    </svg>
  )
}
