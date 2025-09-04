import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { toast } from "react-toastify"

const courseColors = [
  "#4F46E5", "#7C3AED", "#EC4899", "#EF4444", "#F59E0B", 
  "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#F97316"
]

const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    schedule: "",
    location: "",
    credits: "",
    semester: "Fall 2024",
    color: courseColors[0]
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.code || !formData.instructor) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits) || 3
      }
      
      await courseService.create(courseData)
      
      setFormData({
        name: "",
        code: "",
        instructor: "",
        schedule: "",
        location: "",
        credits: "",
        semester: "Fall 2024",
        color: courseColors[0]
      })
      
      onCourseAdded?.()
      onClose()
      toast.success("Course added successfully")
    } catch (error) {
      toast.error("Failed to add course")
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
            <h2 className="text-xl font-semibold text-gray-900">Add New Course</h2>
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
            label="Course Name *"
            placeholder="Introduction to Computer Science"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />

          <Input
            label="Course Code *"
            placeholder="CS 101"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
          />

          <Input
            label="Instructor *"
            placeholder="Dr. Smith"
            value={formData.instructor}
            onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
          />

          <Input
            label="Schedule"
            placeholder="MWF 10:00-11:00 AM"
            value={formData.schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
          />

          <Input
            label="Location"
            placeholder="Room 204, Science Building"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Credits"
              type="number"
              placeholder="3"
              min="1"
              max="6"
              value={formData.credits}
              onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
            />

            <Select
              label="Semester"
              value={formData.semester}
              onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
            >
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Summer 2024">Summer 2024</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {courseColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === color
                      ? "border-gray-400 scale-110"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
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
              Add Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourseModal