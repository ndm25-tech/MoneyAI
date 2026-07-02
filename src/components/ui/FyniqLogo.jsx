function FyniqLogo({ size = 32, className = '' }) {
  const id = 'fyniq-grad'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Fyniq Logo"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5CC" />
          <stop offset="100%" stopColor="#7B3FE4" />
        </linearGradient>
      </defs>
      {/* Outer circle */}
      <circle cx="50" cy="50" r="46" stroke={`url(#${id})`} strokeWidth="4" fill="none" />
      {/* F letter */}
      <path
        d="M34 28 H62 Q66 28 66 32 Q66 36 62 36 H42 V47 H58 Q62 47 62 51 Q62 55 58 55 H42 V72"
        stroke={`url(#${id})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dot */}
      <circle cx="42" cy="80" r="4.5" fill={`url(#${id})`} />
    </svg>
  )
}

export default FyniqLogo
