<template>
  <div
    class="task-card"
    draggable="true"
    @dragstart="onDragStart"
    @click="onClick"
  >
    <div class="task-name">{{ task.name }}</div>
    <div class="task-description">{{ task.description }}</div>
    <div class="task-info">
      <span class="task-due-date">📅 {{ formatDate(task.dueDate) }}</span>
      <span class="task-assignee">👤 {{ task.assignee }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object,
  sectionId: String,
  onClick: Function
})

const onDragStart = (e) => {
  e.dataTransfer.setData('taskId', props.task._id)
  e.dataTransfer.setData('sourceSectionId', props.sectionId)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.task-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: background-color 0.2s ease;
}

.task-card:hover {
  background-color: #f0f0f0;
}

.task-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
}

.task-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.task-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
}
</style>
