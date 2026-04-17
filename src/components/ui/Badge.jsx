const colorMap = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  blue:   'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  pink:   'bg-pink-100 text-pink-700',
  teal:   'bg-teal-100 text-teal-700',
  gray:   'bg-gray-100 text-gray-700',
}

function Badge({ text, color = 'gray' }) {
  const classes = colorMap[color] ?? colorMap.gray
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {text}
    </span>
  )
}

export default Badge
