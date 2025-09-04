import React, { useState, useEffect } from "react"
import CalendarGrid from "@/components/organisms/CalendarGrid"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"
import { format, addMonths, subMonths, startOfToday } from "date-fns"

const Calendar = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [currentDate, setCurrentDate] = useState(startOfToday())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ])
      
      setAssignments(assignmentsData)
      setCourses(coursesData)
    } catch (error) {
      setError("Failed to load calendar data")
    } finally {
      setLoading(false)
    }
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1))
  }

  const goToToday = () => {
    setCurrentDate(startOfToday())
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View your assignments and deadlines at a glance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateMonth("prev")}
            />
            
            <div className="text-center min-w-[180px]">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, "MMMM yyyy")}
              </h2>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateMonth("next")}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-surface rounded-lg border border-gray-100">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Info" className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Course colors:</span>
        </div>
        {courses.slice(0, 6).map((course) => (
          <Badge key={course.Id} color={course.color} size="sm">
            {course.code}
          </Badge>
        ))}
        {courses.length > 6 && (
          <span className="text-sm text-gray-500">+{courses.length - 6} more</span>
        )}
      </div>

      {/* Calendar */}
      <CalendarGrid
        currentDate={currentDate}
        assignments={assignments}
        courses={courses}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-700">This Month</p>
              <p className="text-xl font-bold text-primary-900">
                {assignments.filter(a => {
                  const assignmentDate = new Date(a.dueDate)
                  return assignmentDate.getMonth() === currentDate.getMonth() &&
                         assignmentDate.getFullYear() === currentDate.getFullYear()
                }).length}
              </p>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-xl font-bold text-green-900">
                {assignments.filter(a => a.status === "completed").length}
              </p>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending</p>
              <p className="text-xl font-bold text-yellow-900">
                {assignments.filter(a => a.status !== "completed").length}
              </p>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar