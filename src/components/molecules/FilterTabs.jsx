import React from "react"
import { cn } from "@/utils/cn"

const FilterTabs = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div className={cn("inline-flex rounded-lg bg-surface p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            activeTab === tab.id
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-0.5 text-xs rounded-full",
              activeTab === tab.id
                ? "bg-primary-100 text-primary-600"
                : "bg-gray-200 text-gray-600"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs