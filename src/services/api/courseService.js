import coursesData from "@/services/mockData/courses.json"

class CourseService {
  constructor() {
    this.courses = [...coursesData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300))
  }

  async getAll() {
    await this.delay()
    return [...this.courses]
  }

  async getById(id) {
    await this.delay()
    const course = this.courses.find(c => c.Id === parseInt(id))
    if (!course) {
      throw new Error("Course not found")
    }
    return { ...course }
  }

  async create(courseData) {
    await this.delay()
    const maxId = Math.max(...this.courses.map(c => c.Id), 0)
    const newCourse = {
      ...courseData,
      Id: maxId + 1
    }
    this.courses.push(newCourse)
    return { ...newCourse }
  }

  async update(id, courseData) {
    await this.delay()
    const index = this.courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    this.courses[index] = { ...courseData, Id: parseInt(id) }
    return { ...this.courses[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    this.courses.splice(index, 1)
    return true
  }
}

export const courseService = new CourseService()