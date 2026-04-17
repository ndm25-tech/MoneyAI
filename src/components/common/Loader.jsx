function Loader({ size = 'md', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-primary-600 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Laden..."
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  )
}

export default Loader
