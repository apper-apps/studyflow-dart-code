class GradeService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'grade_c'
    
    // Define field mappings from mock data to database fields
    this.fieldMappings = {
      courseId: 'course_id_c', // Mock courseId → DB course_id_c (Lookup to course_c, Updateable)
      category: 'category_c', // Mock category → DB category_c (Updateable)
      weight: 'weight_c', // Mock weight → DB weight_c (Updateable)
      earned: 'earned_c', // Mock earned → DB earned_c (Updateable)
      total: 'total_c' // Mock total → DB total_c (Updateable)
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } }, // System field
          { field: { Name: "Tags" } }, // Updateable
          { field: { Name: "course_id_c" } }, // Lookup field - returns object with Id and Name
          { field: { Name: "category_c" } }, // Updateable
          { field: { Name: "weight_c" } }, // Updateable
          { field: { Name: "earned_c" } }, // Updateable
          { field: { Name: "total_c" } } // Updateable
        ],
        orderBy: [
          {
            fieldName: "course_id_c",
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
      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || null, // Extract ID from lookup object
        category: grade.category_c || '',
        weight: grade.weight_c || 0,
        earned: grade.earned_c || 0,
        total: grade.total_c || 100
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message)
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "earned_c" } },
          { field: { Name: "total_c" } }
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response || !response.data) {
        throw new Error("Grade not found")
      }

      // Transform database response to match expected format
      const grade = response.data
      return {
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || null,
        category: grade.category_c || '',
        weight: grade.weight_c || 0,
        earned: grade.earned_c || 0,
        total: grade.total_c || 100
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "earned_c" } },
          { field: { Name: "total_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          {
            fieldName: "weight_c",
            sorttype: "DESC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      // Transform database response to match expected format
      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || null,
        category: grade.category_c || '',
        weight: grade.weight_c || 0,
        earned: grade.earned_c || 0,
        total: grade.total_c || 100
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return []
    }
  }

  async create(gradeData) {
    try {
      // Transform mock data format to database format using only Updateable fields
      const dbData = {
        Name: gradeData.category || 'Grade Category', // Use category for Name field
        course_id_c: parseInt(gradeData.courseId), // Lookup field - send as integer ID
        category_c: gradeData.category || '',
        weight_c: parseFloat(gradeData.weight) || 0,
        earned_c: parseFloat(gradeData.earned) || 0,
        total_c: parseFloat(gradeData.total) || 100
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
          console.error(`Failed to create grade records:${JSON.stringify(failedRecords)}`)
          
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
          const grade = successRecord.data
          return {
            Id: grade.Id,
            courseId: grade.course_id_c?.Id || parseInt(gradeData.courseId),
            category: grade.category_c || '',
            weight: grade.weight_c || 0,
            earned: grade.earned_c || 0,
            total: grade.total_c || 100
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  async update(id, gradeData) {
    try {
      // Transform mock data format to database format using only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: gradeData.category || 'Grade Category',
        course_id_c: parseInt(gradeData.courseId),
        category_c: gradeData.category || '',
        weight_c: parseFloat(gradeData.weight) || 0,
        earned_c: parseFloat(gradeData.earned) || 0,
        total_c: parseFloat(gradeData.total) || 100
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
          console.error(`Failed to update grade records:${JSON.stringify(failedRecords)}`)
          
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
          const grade = successRecord.data
          return {
            Id: grade.Id,
            courseId: grade.course_id_c?.Id || parseInt(gradeData.courseId),
            category: grade.category_c || '',
            weight: grade.weight_c || 0,
            earned: grade.earned_c || 0,
            total: grade.total_c || 100
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message)
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
          console.error(`Failed to delete grade records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }

        return response.results.some(result => result.success)
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }
}

export const gradeService = new GradeService()