<template>
  <div class="task-card">
    <!-- Top row: Title and menu -->
    <div class="task-header">
      <span class="task-title">{{ task.name }}</span>
      <button ref="toggleBtnRef" @click="toggleMenu" class="menu-btn">⋯</button>
      <div v-if="menuOpen" ref="menuRef" class="dropdown-menu">
        <button @click="handleDelete">Delete</button>
        <button @click="openUpdateForm">Update</button>
      </div>
    </div>

    <!-- Bottom row: Avatar, Due Date, Description -->
    <div class="task-footer">
      <div class="task-meta">
        <img
          :src="avatarUrl"
          class="avatar"
          :title="task.assignee || 'Unassigned'"
        />
        <span :style="{ color: dueColor }" class="due-date">{{ dueText }}</span>
      </div>
      <button v-if="task.description" class="desc-btn">{{ task.description }}</button>
    </div>

    <!-- Update Task Modal -->
    <UpdateTaskForm
      :open="isUpdateFormOpen"
      @update:open="isUpdateFormOpen = $event"
      :task="task"
      :sectionId="sectionId"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useKanbanStore } from '../store/useKanbanStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'

import UpdateTaskForm from './UpdateTaskForm.vue'

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isYesterday)

const props = defineProps({
  task: Object,
  sectionId: String,
})

const menuOpen = ref(false)
const menuRef = ref(null)
const toggleBtnRef = ref(null)
const isUpdateFormOpen = ref(false)

const kanbanStore = useKanbanStore()
const { deleteTask } = kanbanStore

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleClickOutside = (event) => {
  const menuEl = menuRef.value
  const toggleEl = toggleBtnRef.value

  if (
    menuEl &&
    !menuEl.contains(event.target) &&
    toggleEl &&
    !toggleEl.contains(event.target)
  ) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const openUpdateForm = () => {
  isUpdateFormOpen.value = true
  menuOpen.value = false
}

const handleDelete = () => {
  if (confirm(`Are you sure you want to delete the task "${props.task.name}"?`)) {
    deleteTask({ sectionId: props.sectionId, taskId: props.task._id })
  }
  menuOpen.value = false
}

const getDueDate = (dateStr) => {
  const date = dayjs(dateStr)
  if (date.isToday()) return { text: 'Today', color: '#48494C' }
  if (date.isTomorrow()) return { text: 'Tomorrow', color: '#3B82F6' }
  if (date.isYesterday()) return { text: 'Yesterday', color: '#EF4444' }
  return { text: date.format('DD MMM'), color: '#6B7280' }
}

const { text: dueText, color: dueColor } = getDueDate(props.task.dueDate)

const avatarUrl = props.task.assignee
  ? `https://avatar.iran.liara.run/username?username=${props.task.assignee}`
  : '?'
</script>


<style scoped>
.task-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: grab;
  transition: all 0.15s ease;
}
.task-card.dragging {
  opacity: 0.5;
}

.task-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-title {
  font-weight: 600;
}
.menu-btn {
  position: relative;
  z-index: 2;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0; /* Align to the right of the ⋯ icon */
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 0.25rem;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
.dropdown-menu button {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  text-align: left;
  cursor: pointer;
}
.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.due-date {
  font-size: 0.75rem;
  font-weight: 600;
}
.desc-btn {
  background: #f3f4f6;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  cursor: default;
}
.desc-btn:hover {
  background: #e5e7eb;
}
</style>
