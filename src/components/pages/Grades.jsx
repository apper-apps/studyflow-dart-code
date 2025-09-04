import React, { useState, useEffect } from "react"
import GradeCalculator from "@/components/organisms/GradeCalculator"
import SearchBar from "@/components/molecules/SearchBar"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ProgressRing from "@/components/atoms/ProgressRing"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { courseService } from "@/services/api/courseService"
import { gradeService } from "@/services/api/gradeService"

const Grades = () => {
  const [courses, setCourses] = useState([])
  const [grades, setGrades] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [coursesData, gradesData] = await Promise.all([
        courseService.getAll(),
        gradeService.getAll()
      ])
      
      setCourses(coursesData)
      setGrades(gradesData)
      
      // Auto-select first course if none selected
      if (!selectedCourse && coursesData.length > 0) {
        setSelectedCourse(coursesData[0])
      }
    } catch (error) {
      setError("Failed to load grades")
    } finally {
      setLoading(false)
    }
  }

  const calculateCourseAverage = (courseId) => {
    const courseGrades = grades.filter(g => g.courseId === courseId)
    if (courseGrades.length === 0) return 0
    
    let totalWeightedPoints = 0
    let totalWeight = 0
    
    courseGrades.forEach(grade => {
      const percentage = (grade.earned / grade.total) * 100
      totalWeightedPoints += percentage * (grade.weight / 100)
      totalWeight += grade.weight
    })
    
    return totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0
  }

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "#10B981"
    if (percentage >= 80) return "#3B82F6"
    if (percentage >= 70) return "#F59E0B"
    return "#EF4444"
  }

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  const calculateGPA = () => {
    if (courses.length === 0) return 0
    
    const gradePoints = {
      "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0
    }
    
    let totalPoints = 0
    let totalCredits = 0
    
    courses.forEach(course => {
      const average = calculateCourseAverage(course.Id)
      if (average > 0) {
        const letterGrade = getLetterGrade(average)
        totalPoints += gradePoints[letterGrade] * course.credits
        totalCredits += course.credits
      }
    })
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  if (courses.length === 0) {
    return (
      <Empty
        icon="Award"
        title="No Courses to Grade"
        description="Add courses first to start tracking your grades and calculating your GPA."
        action="BookOpen"
        actionLabel="Go to Courses"
        onAction={() => {}}
      />
    )
  }

  const gpa = calculateGPA()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Grades</h1>
        <p className="text-gray-600 mt-1">Calculate grades and track your academic performance</p>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Current GPA</p>
                <p className="text-3xl font-bold text-primary-900">
                  {gpa > 0 ? gpa.toFixed(2) : "N/A"}
                </p>
              </div>
              <ProgressRing
                progress={gpa > 0 ? (gpa / 4.0) * 100 : 0}
                color="#4F46E5"
                size={60}
                strokeWidth={4}
              >
                <span className="text-xs font-bold text-primary-600">
                  {gpa > 0 ? Math.round((gpa / 4.0) * 100) : 0}%
                </span>
              </ProgressRing>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-700">Courses Graded</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {courses.filter(course => calculateCourseAverage(course.Id) > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  /{courses.length}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Credits</p>
                <p className="text-3xl font-bold text-green-900">
                  {courses.reduce((sum, course) => sum + course.credits, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs">CRED</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="lg:col-span-1 space-y-4">
          <SearchBar
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
          />
          
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900">Course Grades</h2>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="space-y-1">
                {filteredCourses.map((course) => {
                  const average = calculateCourseAverage(course.Id)
                  const isSelected = selectedCourse?.Id === course.Id
                  
                  return (
                    <button
                      key={course.Id}
                      onClick={() => setSelectedCourse(course)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-surface transition-colors ${
                        isSelected ? "bg-primary-50 border-l-4 border-l-primary-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: course.color }}
                            />
                            <span className="font-medium text-gray-900">{course.code}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.credits} credits</p>
                        </div>
                        <div className="text-right">
                          {average > 0 ? (
                            <>
                              <Badge color={getGradeColor(average)} className="mb-1">
                                {getLetterGrade(average)}
                              </Badge>
                              <p className="text-xs text-gray-600">
                                {Math.round(average)}%
                              </p>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">No grades</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Grade Calculator */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <GradeCalculator
              courseId={selectedCourse.Id}
              course={selectedCourse}
              onUpdate={loadData}
            />
          ) : (
            <Empty
              icon="Calculator"
              title="Select a Course"
              description="Choose a course from the list to calculate and manage grades."
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Grades