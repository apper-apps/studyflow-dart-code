import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ message, onRetry, type = "default" }) => {
  const defaultMessage = "Something went wrong. Please try again."

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-semantic-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {type === "network" ? "Connection Error" : "Error"}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message || defaultMessage}
      </p>

      {onRetry && (
        <Button
          variant="primary"
          icon="RefreshCw"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error