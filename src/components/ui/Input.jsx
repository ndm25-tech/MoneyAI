import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, id, error, helpText, className = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
    </div>
  )
})

export default Input
