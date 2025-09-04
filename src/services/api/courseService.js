class CourseService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'course_c'
    
    // Define field mappings from mock data to database fields
    this.fieldMappings = {
      name: 'Name', // Mock name → DB Name (Updateable)
      code: 'code_c', // Mock code → DB code_c (Updateable)  
      instructor: 'instructor_c', // Mock instructor → DB instructor_c (Updateable)
      schedule: 'schedule_c', // Mock schedule → DB schedule_c (Updateable)
      location: 'location_c', // Mock location → DB location_c (Updateable)
      credits: 'credits_c', // Mock credits → DB credits_c (Updateable)
      semester: 'semester_c', // Mock semester → DB semester_c (Updateable)
      color: 'color_c' // Mock color → DB color_c (Updateable)
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } }, // System field - always included
          { field: { Name: "Tags" } }, // Updateable
          { field: { Name: "code_c" } }, // Updateable
          { field: { Name: "instructor_c" } }, // Updateable  
          { field: { Name: "schedule_c" } }, // Updateable
          { field: { Name: "location_c" } }, // Updateable
          { field: { Name: "color_c" } }, // Updateable
          { field: { Name: "credits_c" } }, // Updateable
          { field: { Name: "semester_c" } } // Updateable
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      // Transform database response to match expected format
      return response.data.map(course => ({
        Id: course.Id,
        name: course.Name || '',
        code: course.code_c || '',
        instructor: course.instructor_c || '',
        schedule: course.schedule_c || '',
        location: course.location_c || '',
        color: course.color_c || '#4F46E5',
        credits: course.credits_c || 3,
        semester: course.semester_c || 'Fall 2024'
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } }
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response || !response.data) {
        throw new Error("Course not found")
      }

      // Transform database response to match expected format
      const course = response.data
      return {
        Id: course.Id,
        name: course.Name || '',
        code: course.code_c || '',
        instructor: course.instructor_c || '',
        schedule: course.schedule_c || '',
        location: course.location_c || '',
        color: course.color_c || '#4F46E5',
        credits: course.credits_c || 3,
        semester: course.semester_c || 'Fall 2024'
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  async create(courseData) {
    try {
      // Transform mock data format to database format using only Updateable fields
      const dbData = {
        Name: courseData.name || '',
        code_c: courseData.code || '',
        instructor_c: courseData.instructor || '',
        schedule_c: courseData.schedule || '',
        location_c: courseData.location || '',
        color_c: courseData.color || '#4F46E5',
        credits_c: parseInt(courseData.credits) || 3,
        semester_c: courseData.semester || 'Fall 2024'
      }

      const params = {
        records: [dbData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }

        const successRecord = response.results.find(result => result.success)
        if (successRecord) {
          // Transform response back to expected format
          const course = successRecord.data
          return {
            Id: course.Id,
            name: course.Name || '',
            code: course.code_c || '',
            instructor: course.instructor_c || '',
            schedule: course.schedule_c || '',
            location: course.location_c || '',
            color: course.color_c || '#4F46E5',
            credits: course.credits_c || 3,
            semester: course.semester_c || 'Fall 2024'
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  async update(id, courseData) {
    try {
      // Transform mock data format to database format using only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: courseData.name || '',
        code_c: courseData.code || '',
        instructor_c: courseData.instructor || '',
        schedule_c: courseData.schedule || '',
        location_c: courseData.location || '',
        color_c: courseData.color || '#4F46E5',
        credits_c: parseInt(courseData.credits) || 3,
        semester_c: courseData.semester || 'Fall 2024'
      }

      const params = {
        records: [dbData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update course records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }

        const successRecord = response.results.find(result => result.success)
        if (successRecord) {
          // Transform response back to expected format
          const course = successRecord.data
          return {
            Id: course.Id,
            name: course.Name || '',
            code: course.code_c || '',
            instructor: course.instructor_c || '',
            schedule: course.schedule_c || '',
            location: course.location_c || '',
            color: course.color_c || '#4F46E5',
            credits: course.credits_c || 3,
            semester: course.semester_c || 'Fall 2024'
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete course records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }

        return response.results.some(result => result.success)
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }
}

export const courseService = new CourseService()