import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"
import { toast } from "react-toastify"

const AddAssignmentModal = ({ isOpen, onClose, onAssignmentAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    type: "assignment",
    dueDate: "",
    priority: "medium",
    notes: ""
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadCourses()
    }
  }, [isOpen])

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll()
      setCourses(data)
    } catch (error) {
      console.error("Error loading courses:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.courseId || !formData.dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const assignmentData = {
        ...formData,
        status: "not-started",
        weight: 10 // Default weight
      }
      
      await assignmentService.create(assignmentData)
      
      setFormData({
        title: "",
        courseId: "",
        type: "assignment",
        dueDate: "",
        priority: "medium",
        notes: ""
      })
      
      onAssignmentAdded?.()
      onClose()
      toast.success("Assignment added successfully")
    } catch (error) {
      toast.error("Failed to add assignment")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add New Assignment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Assignment Title *"
            placeholder="Chapter 5 Reading Assignment"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />

          <Select
            label="Course *"
            value={formData.courseId}
            onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.Id} value={course.Id}>
                {course.code} - {course.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
              <option value="project">Project</option>
              <option value="presentation">Presentation</option>
            </Select>

            <Input
              label="Due Date *"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              placeholder="Additional notes about this assignment..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-300"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Add Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAssignmentModal