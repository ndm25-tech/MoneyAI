function Select({ label, id, options = [], error, helpText, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-3 rounded-xl border text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
    </div>
  )
}

export default Select
