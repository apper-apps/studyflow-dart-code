import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "hover:border-gray-300",
          error && "border-semantic-error focus:ring-semantic-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-semantic-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input