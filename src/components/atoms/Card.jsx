import React from "react"
import { cn } from "@/utils/cn"

const Card = ({ 
  className, 
  children,
  hover = false,
  onClick,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-card border border-gray-100 shadow-card",
        hover && "transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  )
}

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-6 pt-4", className)} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card