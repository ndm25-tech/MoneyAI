function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-gray-100 ${
        padding ? 'p-6' : ''
      } ${hover ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
