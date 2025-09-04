import React, { useState, useEffect } from "react"
import AssignmentItem from "@/components/organisms/AssignmentItem"
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal"
import SearchBar from "@/components/molecules/SearchBar"
import FilterTabs from "@/components/molecules/FilterTabs"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"
import { format, parseISO, isPast } from "date-fns"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [showAddModal, setShowAddModal] = useState(false)

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
      setError("Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAndSortedAssignments = () => {
    let filtered = assignments

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (activeFilter !== "all") {
      if (activeFilter === "overdue") {
        filtered = filtered.filter(assignment => 
          isPast(parseISO(assignment.dueDate)) && assignment.status !== "completed"
        )
      } else {
        filtered = filtered.filter(assignment => assignment.status === activeFilter)
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate)
        case "priority":
          const priorityOrder = { "high": 3, "medium": 2, "low": 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "course":
          const courseA = getCourseById(a.courseId)
          const courseB = getCourseById(b.courseId)
          return (courseA?.name || "").localeCompare(courseB?.name || "")
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId)
  }

  const overdueCount = assignments.filter(assignment => 
    isPast(parseISO(assignment.dueDate)) && assignment.status !== "completed"
  ).length

  const filterTabs = [
    { id: "all", label: "All", count: assignments.length },
    { id: "not-started", label: "Not Started", count: assignments.filter(a => a.status === "not-started").length },
    { id: "in-progress", label: "In Progress", count: assignments.filter(a => a.status === "in-progress").length },
    { id: "completed", label: "Completed", count: assignments.filter(a => a.status === "completed").length },
    { id: "overdue", label: "Overdue", count: overdueCount }
  ]

  const filteredAssignments = getFilteredAndSortedAssignments()

  // Group assignments by due date for better organization
  const groupedAssignments = filteredAssignments.reduce((groups, assignment) => {
    const dueDate = parseISO(assignment.dueDate)
    const dateKey = format(dueDate, "yyyy-MM-dd")
    const dateLabel = format(dueDate, "EEEE, MMMM d, yyyy")
    
    if (!groups[dateKey]) {
      groups[dateKey] = { label: dateLabel, assignments: [] }
    }
    groups[dateKey].assignments.push(assignment)
    return groups
  }, {})

  if (loading) return <Loading type="list" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Track and manage all your coursework</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddModal(true)}
        >
          Add Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Empty
          icon="FileText"
          title="No Assignments Yet"
          description="Start by adding your first assignment to keep track of your coursework."
          action="Plus"
          actionLabel="Add Assignment"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="flex-1"
            />
            
            <div className="flex gap-4">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[140px]"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="course">Course</option>
                <option value="title">Title</option>
              </Select>
              
              <FilterTabs
                tabs={filterTabs}
                activeTab={activeFilter}
                onTabChange={setActiveFilter}
              />
            </div>
          </div>

          {/* Assignments List */}
          {filteredAssignments.length === 0 ? (
            <Empty
              icon="Search"
              title="No Assignments Found"
              description="Try adjusting your search terms or filters to find assignments."
            />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAssignments).map(([dateKey, group]) => (
                <div key={dateKey} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    {group.label}
                  </h3>
                  <div className="space-y-3">
                    {group.assignments.map((assignment) => {
                      const course = getCourseById(assignment.courseId)
                      return (
                        <AssignmentItem
                          key={assignment.Id}
                          assignment={assignment}
                          course={course}
                          onUpdate={loadData}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddAssignmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAssignmentAdded={loadData}
      />
    </div>
  )
}

export default Assignments