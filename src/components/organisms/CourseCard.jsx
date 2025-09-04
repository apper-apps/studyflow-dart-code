import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressRing from "@/components/atoms/ProgressRing"
import ApperIcon from "@/components/ApperIcon"

const CourseCard = ({ course, assignments = [], grades = [] }) => {
  const completedAssignments = assignments.filter(a => a.status === "completed").length
  const totalAssignments = assignments.length
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0

  const averageGrade = grades.length > 0 
    ? grades.reduce((acc, grade) => acc + (grade.earned / grade.total) * 100, 0) / grades.length
    : 0

  const getGradeColor = (grade) => {
    if (grade >= 90) return "#10B981"
    if (grade >= 80) return "#3B82F6"
    if (grade >= 70) return "#F59E0B"
    return "#EF4444"
  }

  return (
    <Card className="h-full" hover>
      <Card.Header>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.code}</p>
            <p className="text-sm text-gray-500">{course.instructor}</p>
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: course.color }}
          >
            {course.code.split(" ")[0]}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>{course.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Star" className="h-4 w-4" />
            <span>{course.credits} Credits</span>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">Course Progress</p>
            <p className="text-xs text-gray-600">
              {completedAssignments}/{totalAssignments} assignments completed
            </p>
          </div>
          
          <ProgressRing
            progress={completionRate}
            color={course.color}
            size={48}
            strokeWidth={3}
          >
            <span className="text-xs font-bold" style={{ color: course.color }}>
              {Math.round(completionRate)}%
            </span>
          </ProgressRing>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Current Grade
            </span>
            <Badge 
              color={getGradeColor(averageGrade)}
              className="font-semibold"
            >
              {averageGrade > 0 ? `${Math.round(averageGrade)}%` : "N/A"}
            </Badge>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default CourseCard