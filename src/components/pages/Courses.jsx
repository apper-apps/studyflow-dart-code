import React, { useState, useEffect } from "react"
import CourseCard from "@/components/organisms/CourseCard"
import AddCourseModal from "@/components/organisms/AddCourseModal"
import SearchBar from "@/components/molecules/SearchBar"
import FilterTabs from "@/components/molecules/FilterTabs"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { gradeService } from "@/services/api/gradeService"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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
      setError("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const getFilteredCourses = () => {
    let filtered = courses

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply semester filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(course => course.semester === activeFilter)
    }

    return filtered
  }

  const semesters = [...new Set(courses.map(course => course.semester))]
  const filterTabs = [
    { id: "all", label: "All Courses", count: courses.length },
    ...semesters.map(semester => ({
      id: semester,
      label: semester,
      count: courses.filter(course => course.semester === semester).length
    }))
  ]

  const filteredCourses = getFilteredCourses()

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Manage your academic courses and track progress</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddModal(true)}
        >
          Add Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No Courses Yet"
          description="Start by adding your first course to begin tracking your academic progress."
          action="Plus"
          actionLabel="Add Course"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="flex-1"
            />
            <FilterTabs
              tabs={filterTabs}
              activeTab={activeFilter}
              onTabChange={setActiveFilter}
            />
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Empty
              icon="Search"
              title="No Courses Found"
              description="Try adjusting your search terms or filters to find courses."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const courseAssignments = assignments.filter(a => a.courseId === course.Id)
                const courseGrades = grades.filter(g => g.courseId === course.Id)
                
                return (
                  <CourseCard
                    key={course.Id}
                    course={course}
                    assignments={courseAssignments}
                    grades={courseGrades}
                  />
                )
              })}
            </div>
          )}
        </>
      )}

      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCourseAdded={loadData}
      />
    </div>
  )
}

export default Courses