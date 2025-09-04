import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  children,
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-700 shadow-md hover:shadow-lg",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 active:from-secondary-700 active:to-secondary-700 shadow-md hover:shadow-lg",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 active:from-accent-700 active:to-accent-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
    danger: "bg-gradient-to-r from-semantic-error to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-700 shadow-md hover:shadow-lg"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        disabled && "hover:shadow-none hover:from-current hover:to-current",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
      {!loading && icon && iconPosition === "left" && <ApperIcon name={icon} className="h-4 w-4" />}
      {children}
      {!loading && icon && iconPosition === "right" && <ApperIcon name={icon} className="h-4 w-4" />}
    </button>
  )
})

Button.displayName = "Button"

export default Button