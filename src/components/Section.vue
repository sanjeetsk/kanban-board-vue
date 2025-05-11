<template>
  <div class="section">
    <div class="section-header">
      <h4>{{ section.name }}</h4>
      <div class="section-actions">
        <button @click="isSectionFormOpen = true">➕</button>
        <button @click="toggleMenu">⋮</button>
        <div v-if="menuOpen" class="dropdown-menu">
          <button @click="handleUpdateSection">Update Title</button>
          <button @click="handleDeleteSection" class="danger">Delete Section</button>
        </div>
      </div>
    </div>

    <draggable
      v-model="section.tasks"
      group="tasks"
      item-key="_id"
      class="task-list"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <TaskCard :task="element" :sectionId="section._id" />
      </template>
    </draggable>

    <button class="add-task-btn" @click="isTaskFormOpen = true">+ Add Task</button>

    <!-- Section Modal -->
    <div v-if="isSectionFormOpen" class="modal">
      <div class="modal-content">
        <h3>Add New Section</h3>
        <input v-model="newSectionTitle" placeholder="Section Title" />
        <div class="modal-actions">
          <button @click="cancelAddSection">Cancel</button>
          <button @click="handleAddSection">Add Section</button>
        </div>
      </div>
    </div>

    <TaskForm
      :open="isTaskFormOpen"
      @update:open="isTaskFormOpen = $event"
      @submit="handleAddTask"
      :defaultAssignee="'Current User'"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import TaskForm from './TaskForm.vue'
import { useKanbanStore } from '../store/useKanbanStore'

const props = defineProps({
  section: Object
})

const kanbanStore = useKanbanStore()
const { addTask, deleteSection, updateSection, moveTask, addSection } = kanbanStore

const isTaskFormOpen = ref(false)
const isSectionFormOpen = ref(false)
const menuOpen = ref(false)
const newSectionTitle = ref('')

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleAddTask = (taskData) => {
  const newTask = { ...taskData, section: props.section._id }
  addTask(newTask)
}

const handleAddSection = () => {
  if (newSectionTitle.value.trim()) {
    addSection({
      name: newSectionTitle.value,
      selectedSectionId: props.section._id
    })
    newSectionTitle.value = ''
    isSectionFormOpen.value = false
  }
}

const cancelAddSection = () => {
  isSectionFormOpen.value = false
  newSectionTitle.value = ''
}

const handleDeleteSection = () => {
  if (confirm(`Are you sure you want to delete the section "${props.section.name}"?`)) {
    deleteSection(props.section._id)
  }
  menuOpen.value = false
}

const handleUpdateSection = () => {
  const newTitle = prompt('Enter new title for the section:', props.section.name)
  if (newTitle && newTitle.trim()) {
    updateSection({ sectionId: props.section._id, name: newTitle })
  }
  menuOpen.value = false
}

// DnD callback
const onDragEnd = (evt) => {
  const { oldIndex, newIndex } = evt
  if (oldIndex !== newIndex) {
    moveTask({
      taskId: props.section.tasks[newIndex]._id,
      sourceSectionId: props.section._id,
      destinationSectionId: props.section._id,
      task: props.section.tasks[newIndex]
    })
  }
}
</script>

<style scoped>
.section {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 300px;
  margin-right: 1rem;
  transition: opacity 0.2s ease;
}
.drag-over {
  opacity: 0.7;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-actions {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 0.5rem;
  z-index: 10;
}
.dropdown-menu button {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.25rem 0;
  text-align: left;
}
.dropdown-menu .danger {
  color: red;
}
.task-list {
  margin-top: 1rem;
  min-height: 200px;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 6px;
}
.add-task-btn {
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: 300px;
}
.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
