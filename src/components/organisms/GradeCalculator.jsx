import React, { useState, useEffect } from "react"
import Card from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { gradeService } from "@/services/api/gradeService"
import { toast } from "react-toastify"

const GradeCalculator = ({ courseId, course, onUpdate }) => {
  const [grades, setGrades] = useState([])
  const [newCategory, setNewCategory] = useState({
    category: "",
    weight: "",
    earned: "",
    total: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGrades()
  }, [courseId])

  const loadGrades = async () => {
    try {
      setLoading(true)
      const data = await gradeService.getByCourse(courseId)
      setGrades(data)
    } catch (error) {
      console.error("Error loading grades:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateWeightedAverage = () => {
    if (grades.length === 0) return 0
    
    let totalWeightedPoints = 0
    let totalWeight = 0
    
    grades.forEach(grade => {
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

  const handleAddGrade = async (e) => {
    e.preventDefault()
    if (!newCategory.category || !newCategory.weight || !newCategory.earned || !newCategory.total) {
      toast.error("Please fill in all fields")
      return
    }

try {
      const gradeData = {
        courseId: courseId,
        category: newCategory.category,
        weight: parseFloat(newCategory.weight),
        earned: parseFloat(newCategory.earned),
        total: parseFloat(newCategory.total)
      }

      await gradeService.create(gradeData)
      setNewCategory({ category: "", weight: "", earned: "", total: "" })
      loadGrades()
      onUpdate?.()
      toast.success("Grade added successfully")
    } catch (error) {
      toast.error("Failed to add grade")
    }
  }

  const handleDeleteGrade = async (gradeId) => {
    try {
      await gradeService.delete(gradeId)
      loadGrades()
      onUpdate?.()
      toast.success("Grade deleted successfully")
    } catch (error) {
      toast.error("Failed to delete grade")
    }
  }

  const currentAverage = calculateWeightedAverage()

  if (loading) {
    return (
      <Card>
        <Card.Content className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Grade Calculator</h3>
          {course && (
            <Badge color={course.color} className="font-semibold">
              {course.code}
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Content>
        {/* Current Grade Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Grade</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentAverage > 0 ? `${Math.round(currentAverage)}%` : "N/A"}
              </p>
            </div>
            {currentAverage > 0 && (
              <div className="text-right">
                <Badge 
                  color={getGradeColor(currentAverage)}
                  className="text-lg font-bold px-3 py-1"
                >
                  {getLetterGrade(currentAverage)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Grades List */}
        <div className="space-y-3 mb-6">
          {grades.map((grade) => {
            const percentage = (grade.earned / grade.total) * 100
            return (
              <div
                key={grade.Id}
                className="flex items-center justify-between p-3 bg-surface rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{grade.category}</p>
                  <p className="text-sm text-gray-600">
                    {grade.earned}/{grade.total} points ({grade.weight}% of grade)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color={getGradeColor(percentage)}>
                    {Math.round(percentage)}%
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDeleteGrade(grade.Id)}
                    className="text-semantic-error hover:bg-red-50"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Grade Form */}
        <form onSubmit={handleAddGrade} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Category"
              placeholder="Midterm, Quiz, etc."
              value={newCategory.category}
              onChange={(e) => setNewCategory(prev => ({ ...prev, category: e.target.value }))}
            />
            <Input
              label="Weight (%)"
              type="number"
              placeholder="25"
              min="0"
              max="100"
              value={newCategory.weight}
              onChange={(e) => setNewCategory(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Points Earned"
              type="number"
              placeholder="85"
              min="0"
              step="0.01"
              value={newCategory.earned}
              onChange={(e) => setNewCategory(prev => ({ ...prev, earned: e.target.value }))}
            />
            <Input
              label="Total Points"
              type="number"
              placeholder="100"
              min="0"
              step="0.01"
              value={newCategory.total}
              onChange={(e) => setNewCategory(prev => ({ ...prev, total: e.target.value }))}
            />
          </div>
          <Button type="submit" variant="primary" icon="Plus" className="w-full">
            Add Grade
          </Button>
        </form>
      </Card.Content>
    </Card>
  )
}

export default GradeCalculator