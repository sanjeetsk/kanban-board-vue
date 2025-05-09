// stores/useKanbanStore.js
import { defineStore } from 'pinia'
import API from '../Axios/api'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    sections: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSections() {
      this.loading = true
      try {
        const response = await API.get('/section')
        this.sections = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async addSection(sectionData) {
      this.loading = true
      try {
        const response = await API.post('/section', sectionData)
        const newSection = { ...response.data, tasks: [] }
        this.sections.push(newSection)
        this.sections.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      } finally {
        this.loading = false
      }
    },

    async updateSection({ sectionId, name }) {
      await API.put(`/section/${sectionId}`, { name })
      const section = this.sections.find(s => s._id === sectionId)
      if (section) section.name = name
    },

    async deleteSection(sectionId) {
      await API.delete(`/section/${sectionId}`)
      this.sections = this.sections.filter(s => s._id !== sectionId)
    },

    async addTask(taskData) {
      const response = await API.post('/task', taskData)
      const section = this.sections.find(s => s._id === taskData.section)
      if (section) {
        if (!section.tasks) section.tasks = []
        section.tasks.push(response.data.task)
      }
    },

    async updateTask({ taskId, sectionId, taskData }) {
      const response = await API.put(`/task/${taskId}`, taskData)
      const section = this.sections.find(s => s._id === sectionId)
      if (section) {
        const index = section.tasks.findIndex(t => t._id === taskId)
        if (index !== -1) section.tasks[index] = response.data.task
      }
    },

    async deleteTask({ sectionId, taskId }) {
      await API.delete(`/task/${taskId}`)
      const section = this.sections.find(s => s._id === sectionId)
      if (section) section.tasks = section.tasks.filter(t => t._id !== taskId)
    },

    async moveTask({ taskId, sourceSectionId, destinationSectionId }) {
      const response = await API.patch(`/task/move`, {
        taskId,
        sourceSectionId,
        destinationSectionId,
      })

      const source = this.sections.find(s => s._id === sourceSectionId)
      const dest = this.sections.find(s => s._id === destinationSectionId)

      if (source && dest) {
        source.tasks = source.tasks.filter(t => t._id !== taskId)
        if (!dest.tasks) dest.tasks = []
        dest.tasks.push(response.data.task)
      }
    },

    // Optional local state updates
    addSectionLocal(section) {
      this.sections.push(section)
    },

    updateSectionLocal({ sectionId, name }) {
      const section = this.sections.find(s => s._id === sectionId)
      if (section) section.name = name
    },

    deleteSectionLocal(sectionId) {
      this.sections = this.sections.filter(s => s._id !== sectionId)
    },

    addTaskLocal({ sectionId, task }) {
      const section = this.sections.find(s => s._id === sectionId)
      if (section) section.tasks.push(task)
    },
  },
})
