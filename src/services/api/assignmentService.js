import assignmentsData from "@/services/mockData/assignments.json"

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300))
  }

  async getAll() {
    await this.delay()
    return [...this.assignments]
  }

  async getById(id) {
    await this.delay()
    const assignment = this.assignments.find(a => a.Id === parseInt(id))
    if (!assignment) {
      throw new Error("Assignment not found")
    }
    return { ...assignment }
  }

  async getByCourse(courseId) {
    await this.delay()
    return this.assignments
      .filter(a => a.courseId === parseInt(courseId))
      .map(a => ({ ...a }))
  }

  async create(assignmentData) {
    await this.delay()
    const maxId = Math.max(...this.assignments.map(a => a.Id), 0)
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      courseId: parseInt(assignmentData.courseId)
    }
    this.assignments.push(newAssignment)
    return { ...newAssignment }
  }

  async update(id, assignmentData) {
    await this.delay()
    const index = this.assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    this.assignments[index] = { 
      ...assignmentData, 
      Id: parseInt(id),
      courseId: parseInt(assignmentData.courseId)
    }
    return { ...this.assignments[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    this.assignments.splice(index, 1)
    return true
  }
}

export const assignmentService = new AssignmentService()