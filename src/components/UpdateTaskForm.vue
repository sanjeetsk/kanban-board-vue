<template>
  <div v-if="open" class="dialog-overlay">
    <div class="dialog" ref="dialogRef">
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
        <button @click="emitClose">Cancel</button>
        <button class="primary" @click="handleSubmit">Update Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useKanbanStore } from '../store/useKanbanStore'

const props = defineProps({
  open: Boolean,
  task: Object,
  sectionId: String
})
const emit = defineEmits(['update:open'])

const kanbanStore = useKanbanStore()

const dialogRef = ref(null)

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
}, { immediate: true })

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (dialogRef.value && !dialogRef.value.contains(event.target)) {
    emitClose()
  }
}

const handleSubmit = () => {
  kanbanStore.updateTask({
    taskId: props.task._id,
    sectionId: props.sectionId,
    taskData: {
      ...taskData.value,
      section: props.sectionId
    }
  })
  emitClose()
}

const emitClose = () => {
  emit('update:open', false)
}
</script>

<style scoped>
@import '@/styles/dialog.css';
</style>
