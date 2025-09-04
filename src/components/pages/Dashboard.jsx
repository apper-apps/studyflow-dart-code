import React, { useState, useEffect } from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressRing from "@/components/atoms/ProgressRing"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { gradeService } from "@/services/api/gradeService"
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns"

const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ])
      
      setCourses(coursesData)
      setAssignments(assignmentsData)
      setGrades(gradesData)
    } catch (error) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />
  if (courses.length === 0) {
    return (
      <Empty
        icon="GraduationCap"
        title="Welcome to StudyFlow!"
        description="Get started by adding your courses and assignments to track your academic progress."
        action="Plus"
        actionLabel="Add Your First Course"
        onAction={() => {}}
      />
    )
  }

  const upcomingAssignments = assignments
    .filter(assignment => assignment.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const overdue = assignments.filter(assignment => 
    isPast(parseISO(assignment.dueDate)) && assignment.status !== "completed"
  ).length

  const completed = assignments.filter(assignment => 
    assignment.status === "completed"
  ).length

  const totalAssignments = assignments.length
  const completionRate = totalAssignments > 0 ? (completed / totalAssignments) * 100 : 0

  const formatDueDate = (dateString) => {
    const date = parseISO(dateString)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d")
  }

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's your academic overview for {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Total Courses</p>
                <p className="text-2xl font-bold text-primary-900">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-700">Assignments</p>
                <p className="text-2xl font-bold text-secondary-900">{totalAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="FileText" className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900">{Math.round(completionRate)}%</p>
              </div>
              <ProgressRing
                progress={completionRate}
                color="#10B981"
                size={48}
                strokeWidth={3}
              />
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="AlertCircle" className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
              <Badge variant="info">{upcomingAssignments.length} pending</Badge>
            </div>
          </Card.Header>
          <Card.Content>
            {upcomingAssignments.length === 0 ? (
              <Empty
                icon="CheckCircle"
                title="All Caught Up!"
                description="No upcoming assignments. Great job staying on top of your work!"
              />
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const course = getCourseById(assignment.courseId)
                  const dueDate = parseISO(assignment.dueDate)
                  const isOverdue = isPast(dueDate)
                  
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-center space-x-4 p-3 bg-surface rounded-lg hover:shadow-card transition-all duration-200"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course?.color || "#6B7280" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {assignment.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge color={course?.color} size="sm">
                            {course?.code || "N/A"}
                          </Badge>
                          <span className={`text-sm flex items-center space-x-1 ${
                            isOverdue ? "text-semantic-error" : "text-gray-600"
                          }`}>
                            <ApperIcon name="Calendar" className="h-3 w-3" />
                            <span>{formatDueDate(assignment.dueDate)}</span>
                            {isOverdue && <span className="text-xs">(Overdue)</span>}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        color={assignment.priority === "high" ? "#EF4444" : 
                              assignment.priority === "medium" ? "#F59E0B" : "#10B981"}
                        size="sm"
                      >
                        {assignment.priority}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Due Today</span>
                  <span className="font-semibold text-gray-900">
                    {assignments.filter(a => isToday(parseISO(a.dueDate)) && a.status !== "completed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Due Tomorrow</span>
                  <span className="font-semibold text-gray-900">
                    {assignments.filter(a => isTomorrow(parseISO(a.dueDate)) && a.status !== "completed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-semantic-success">
                    {completed}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Total Progress</span>
                  <ProgressRing
                    progress={completionRate}
                    color="#4F46E5"
                    size={32}
                    strokeWidth={2}
                  >
                    <span className="text-xs font-bold text-primary-600">
                      {Math.round(completionRate)}%
                    </span>
                  </ProgressRing>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900">Course Overview</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {courses.slice(0, 4).map((course) => {
                  const courseAssignments = assignments.filter(a => a.courseId === course.Id)
                  const courseGrades = grades.filter(g => g.courseId === course.Id)
                  const averageGrade = courseGrades.length > 0 
                    ? courseGrades.reduce((acc, grade) => acc + (grade.earned / grade.total) * 100, 0) / courseGrades.length
                    : 0

                  return (
                    <div key={course.Id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {course.code}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">
                          {courseAssignments.length} tasks
                        </span>
                        {averageGrade > 0 && (
                          <Badge variant="success" size="sm">
                            {Math.round(averageGrade)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard