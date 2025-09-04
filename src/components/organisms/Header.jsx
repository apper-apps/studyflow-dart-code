import React from "react"
import ApperIcon from "@/components/ApperIcon"
import QuickActions from "@/components/molecules/QuickActions"

const Header = ({ title, subtitle, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="h-5 w-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <QuickActions />
        </div>
      </div>
    </header>
  )
}

export default Header