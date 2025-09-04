import gradesData from "@/services/mockData/grades.json"

class GradeService {
  constructor() {
    this.grades = [...gradesData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300))
  }

  async getAll() {
    await this.delay()
    return [...this.grades]
  }

  async getById(id) {
    await this.delay()
    const grade = this.grades.find(g => g.Id === parseInt(id))
    if (!grade) {
      throw new Error("Grade not found")
    }
    return { ...grade }
  }

  async getByCourse(courseId) {
    await this.delay()
    return this.grades
      .filter(g => g.courseId === parseInt(courseId))
      .map(g => ({ ...g }))
  }

  async create(gradeData) {
    await this.delay()
    const maxId = Math.max(...this.grades.map(g => g.Id), 0)
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      courseId: parseInt(gradeData.courseId)
    }
    this.grades.push(newGrade)
    return { ...newGrade }
  }

  async update(id, gradeData) {
    await this.delay()
    const index = this.grades.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Grade not found")
    }
    this.grades[index] = { 
      ...gradeData, 
      Id: parseInt(id),
      courseId: parseInt(gradeData.courseId)
    }
    return { ...this.grades[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.grades.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Grade not found")
    }
    this.grades.splice(index, 1)
    return true
  }
}

export const gradeService = new GradeService()