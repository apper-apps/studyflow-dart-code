class AssignmentService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'assignment_c'
    
    // Define field mappings from mock data to database fields
    this.fieldMappings = {
      courseId: 'course_id_c', // Mock courseId → DB course_id_c (Lookup to course_c, Updateable)
      title: 'title_c', // Mock title → DB title_c (Updateable)
      type: 'type_c', // Mock type → DB type_c (Updateable)
      dueDate: 'due_date_c', // Mock dueDate → DB due_date_c (Updateable)
      priority: 'priority_c', // Mock priority → DB priority_c (Picklist, Updateable)
      status: 'status_c', // Mock status → DB status_c (Picklist, Updateable)
      grade: 'grade_c', // Mock grade → DB grade_c (Updateable)
      weight: 'weight_c', // Mock weight → DB weight_c (Updateable)
      notes: 'notes_c' // Mock notes → DB notes_c (Updateable)
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } }, // System field
          { field: { Name: "Tags" } }, // Updateable
          { field: { Name: "course_id_c" } }, // Lookup field - returns object with Id and Name
          { field: { Name: "title_c" } }, // Updateable
          { field: { Name: "type_c" } }, // Updateable
          { field: { Name: "due_date_c" } }, // Updateable
          { field: { Name: "priority_c" } }, // Updateable
          { field: { Name: "status_c" } }, // Updateable
          { field: { Name: "grade_c" } }, // Updateable
          { field: { Name: "weight_c" } }, // Updateable
          { field: { Name: "notes_c" } } // Updateable
        ],
        orderBy: [
          {
            fieldName: "due_date_c",
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
      return response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || null, // Extract ID from lookup object
        title: assignment.title_c || '',
        type: assignment.type_c || 'assignment',
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'not-started',
        grade: assignment.grade_c || null,
        weight: assignment.weight_c || 10,
        notes: assignment.notes_c || ''
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message)
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
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "notes_c" } }
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response || !response.data) {
        throw new Error("Assignment not found")
      }

      // Transform database response to match expected format
      const assignment = response.data
      return {
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || null,
        title: assignment.title_c || '',
        type: assignment.type_c || 'assignment',
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'not-started',
        grade: assignment.grade_c || null,
        weight: assignment.weight_c || 10,
        notes: assignment.notes_c || ''
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message)
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
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "notes_c" } }
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
            fieldName: "due_date_c",
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
      return response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || null,
        title: assignment.title_c || '',
        type: assignment.type_c || 'assignment',
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'not-started',
        grade: assignment.grade_c || null,
        weight: assignment.weight_c || 10,
        notes: assignment.notes_c || ''
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return []
    }
  }

  async create(assignmentData) {
    try {
      // Transform mock data format to database format using only Updateable fields
      const dbData = {
        Name: assignmentData.title || 'New Assignment', // Use title for Name field
        course_id_c: parseInt(assignmentData.courseId), // Lookup field - send as integer ID
        title_c: assignmentData.title || '',
        type_c: assignmentData.type || 'assignment',
        due_date_c: assignmentData.dueDate || '',
        priority_c: assignmentData.priority || 'medium',
        status_c: assignmentData.status || 'not-started',
        grade_c: assignmentData.grade || null,
        weight_c: parseInt(assignmentData.weight) || 10,
        notes_c: assignmentData.notes || ''
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
          console.error(`Failed to create assignment records:${JSON.stringify(failedRecords)}`)
          
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
          const assignment = successRecord.data
          return {
            Id: assignment.Id,
            courseId: assignment.course_id_c?.Id || parseInt(assignmentData.courseId),
            title: assignment.title_c || '',
            type: assignment.type_c || 'assignment',
            dueDate: assignment.due_date_c || '',
            priority: assignment.priority_c || 'medium',
            status: assignment.status_c || 'not-started',
            grade: assignment.grade_c || null,
            weight: assignment.weight_c || 10,
            notes: assignment.notes_c || ''
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  async update(id, assignmentData) {
    try {
      // Transform mock data format to database format using only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: assignmentData.title || 'Assignment',
        course_id_c: parseInt(assignmentData.courseId),
        title_c: assignmentData.title || '',
        type_c: assignmentData.type || 'assignment',
        due_date_c: assignmentData.dueDate || '',
        priority_c: assignmentData.priority || 'medium',
        status_c: assignmentData.status || 'not-started',
        grade_c: assignmentData.grade || null,
        weight_c: parseInt(assignmentData.weight) || 10,
        notes_c: assignmentData.notes || ''
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
          console.error(`Failed to update assignment records:${JSON.stringify(failedRecords)}`)
          
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
          const assignment = successRecord.data
          return {
            Id: assignment.Id,
            courseId: assignment.course_id_c?.Id || parseInt(assignmentData.courseId),
            title: assignment.title_c || '',
            type: assignment.type_c || 'assignment',
            dueDate: assignment.due_date_c || '',
            priority: assignment.priority_c || 'medium',
            status: assignment.status_c || 'not-started',
            grade: assignment.grade_c || null,
            weight: assignment.weight_c || 10,
            notes: assignment.notes_c || ''
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message)
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
          console.error(`Failed to delete assignment records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }

        return response.results.some(result => result.success)
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  }
}

export const assignmentService = new AssignmentService()