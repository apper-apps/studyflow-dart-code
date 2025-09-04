import React from "react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay
} from "date-fns"
import { cn } from "@/utils/cn"

const CalendarGrid = ({ currentDate, assignments = [], courses = [] }) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  const getAssignmentsForDay = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    )
  }

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId)
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="bg-white rounded-card border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekdays.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-semibold text-gray-600 bg-surface"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayAssignments = getAssignmentsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] p-2 border-b border-r border-gray-100 last:border-r-0",
                !isCurrentMonth && "bg-gray-50",
                isDayToday && "bg-primary-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-gray-400",
                    isDayToday && "text-primary-700 font-bold",
                    isCurrentMonth && !isDayToday && "text-gray-700"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayAssignments.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                    {dayAssignments.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayAssignments.slice(0, 3).map((assignment) => {
                  const course = getCourseById(assignment.courseId)
                  return (
                    <div
                      key={assignment.Id}
                      className="text-xs p-1.5 rounded truncate transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: course ? `${course.color}20` : "#F3F4F6",
                        color: course?.color || "#374151",
                        border: `1px solid ${course ? `${course.color}40` : "#E5E7EB"}`
                      }}
                      title={`${assignment.title} - ${course?.name || "Unknown Course"}`}
                    >
                      {assignment.title}
                    </div>
                  )
                })}
                {dayAssignments.length > 3 && (
                  <div className="text-xs text-gray-500 px-1.5 py-1">
                    +{dayAssignments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarGrid