<template>
  <div v-if="open" class="dialog-overlay">
    <div class="dialog">
      <h2>Update Task</h2>
      <div class="form-group">
        <label>Task Name</label>
        <input v-model="taskData.name" type="text" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="taskData.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Assignee</label>
        <input v-model="taskData.assignee" type="text" />
      </div>
      <div class="form-group">
        <label>Due Date</label>
        <input v-model="taskData.dueDate" type="date" />
      </div>
      <div class="dialog-actions">
        <button @click="onClose">Cancel</button>
        <button class="primary" @click="handleSubmit">Update Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useKanbanStore } from '@/stores/kanban'

const props = defineProps(['open', 'onClose', 'task', 'sectionId'])
const kanbanStore = useKanbanStore()

const taskData = ref({
  name: '',
  description: '',
  dueDate: '',
  assignee: ''
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    taskData.value = {
      name: newTask.name || '',
      description: newTask.description || '',
      dueDate: newTask.dueDate?.split('T')[0] || '',
      assignee: newTask.assignee || ''
    }
  }
})

const handleSubmit = () => {
  kanbanStore.updateTask({
    taskId: props.task._id,
    sectionId: props.sectionId,
    taskData: {
      ...taskData.value,
      section: props.sectionId
    }
  })
  props.onClose()
}
</script>

<style scoped>
@import '@/styles/dialog.css';
</style>
