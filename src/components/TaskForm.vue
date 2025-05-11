<template>
  <div v-if="open" class="dialog-overlay">
    <div class="dialog" ref="dialogRef">
      <h2>Add New Task</h2>
      <div class="form-group">
        <label>Task Name</label>
        <input v-model="formData.name" type="text" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="formData.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Due Date</label>
        <input v-model="formData.dueDate" type="date" />
      </div>
      <div class="form-group">
        <label>Assignee</label>
        <input v-model="formData.assignee" type="text" />
      </div>
      <div class="dialog-actions">
        <button @click="emitClose">Cancel</button>
        <button class="primary" @click="handleSubmit">Add Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../store/useAuthStore'

const props = defineProps({
  open: Boolean
})
const emit = defineEmits(['update:open', 'submit'])

const authStore = useAuthStore()

const dialogRef = ref(null)

const formData = ref({
  name: '',
  description: '',
  dueDate: '',
  assignee: authStore.user?.name || ''
})

watch(() => authStore.user, (newUser) => {
  formData.value.assignee = newUser?.name || ''
})

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
  emit('submit', { ...formData.value })
  resetForm()
  emit('update:open', false)
}

const emitClose = () => {
  resetForm()
  emit('update:open', false)
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    dueDate: '',
    assignee: authStore.user?.name || ''
  }
}
</script>

<style scoped>
@import '@/styles/dialog.css';
</style>
