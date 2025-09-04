import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal"
import AddCourseModal from "@/components/organisms/AddCourseModal"

const QuickActions = () => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon="BookOpen"
          onClick={() => setShowCourseModal(true)}
        >
          Add Course
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon="Plus"
          onClick={() => setShowAssignmentModal(true)}
        >
          Add Assignment
        </Button>
      </div>

      <AddAssignmentModal 
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
      />
      
      <AddCourseModal 
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
      />
    </>
  )
}

export default QuickActions