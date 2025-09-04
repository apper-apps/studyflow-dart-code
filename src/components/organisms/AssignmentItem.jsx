import React from "react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { assignmentService } from "@/services/api/assignmentService"
import { toast } from "react-toastify"

const AssignmentItem = ({ assignment, course, onUpdate }) => {
  const dueDate = new Date(assignment.dueDate)
  const isOverdue = isPast(dueDate) && assignment.status !== "completed"
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#EF4444"
      case "medium": return "#F59E0B"
      case "low": return "#10B981"
      default: return "#6B7280"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success"
      case "in-progress": return "info"
      case "not-started": return "default"
      default: return "default"
    }
  }

  const formatDueDate = (date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d")
  }

  const handleStatusToggle = async () => {
    try {
      const newStatus = assignment.status === "completed" ? "not-started" : "completed"
      await assignmentService.update(assignment.Id, { ...assignment, status: newStatus })
      onUpdate()
      toast.success(`Assignment marked as ${newStatus === "completed" ? "completed" : "incomplete"}`)
    } catch (error) {
      toast.error("Failed to update assignment")
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-card transition-all duration-200">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleStatusToggle}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            assignment.status === "completed"
              ? "bg-semantic-success border-semantic-success text-white"
              : "border-gray-300 hover:border-primary-500"
          }`}
        >
          {assignment.status === "completed" && (
            <ApperIcon name="Check" className="h-3 w-3" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className={`font-medium ${
                assignment.status === "completed" 
                  ? "text-gray-500 line-through" 
                  : "text-gray-900"
              }`}>
                {assignment.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <Badge color={course?.color} size="sm">
                  {course?.code || "N/A"}
                </Badge>
                <span className={`flex items-center space-x-1 ${
                  isOverdue ? "text-semantic-error" : "text-gray-600"
                }`}>
                  <ApperIcon name="Calendar" className="h-3 w-3" />
                  <span>{formatDueDate(dueDate)}</span>
                  {isOverdue && <span className="text-xs">(Overdue)</span>}
                </span>
                <Badge variant={getStatusColor(assignment.status)} size="sm">
                  {assignment.status.replace("-", " ")}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPriorityColor(assignment.priority) }}
                title={`${assignment.priority} priority`}
              />
              {assignment.grade && (
                <Badge variant="success" size="sm">
                  {assignment.grade}%
                </Badge>
              )}
            </div>
          </div>

          {assignment.notes && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {assignment.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssignmentItem