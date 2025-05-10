<template>
  <div v-if="open" class="dialog-overlay">
    <div class="dialog">
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
        <button @click="onClose">Cancel</button>
        <button class="primary" @click="handleSubmit">Add Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '../store/useAuthStore';

const props = defineProps(['open', 'onClose', 'onSubmit'])
const authStore = useAuthStore()

const formData = ref({
  name: '',
  description: '',
  dueDate: '',
  assignee: authStore.user?.name || ''
})

watch(() => authStore.user, (newUser) => {
  formData.value.assignee = newUser?.name || ''
})

const handleSubmit = () => {
  props.onSubmit({ ...formData.value })
  formData.value = {
    name: '',
    description: '',
    dueDate: '',
    assignee: authStore.user?.name || ''
  }
  props.onClose()
}
</script>

<style scoped>
@import '@/styles/dialog.css';
</style>
