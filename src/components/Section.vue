<template>
  <div class="section">
    <div class="section-header">
      <h4>{{ section.name }}</h4>
      <div class="section-actions">
        <button class="section-actions-btn" @click="isSectionFormOpen = true">+</button>&nbsp;
        <button class="section-actions-btn" @click="toggleMenu">⋯</button>
        <div v-if="menuOpen" class="dropdown-menu" ref="menuRef">
          <button @click="handleUpdateSection">Update Title</button>
          <button @click="handleDeleteSection" class="danger">Delete Section</button>
        </div>
      </div>
    </div>

    <div class="section-box">
      <!-- Draggable area should always be rendered to allow drops -->
      <draggable v-model="section.tasks" group="tasks" item-key="_id" class="task-list" @end="onDragEnd">
        <template #item="{ element }">
          <TaskCard :task="element" :sectionId="section._id" />
        </template>

        <!-- Optional placeholder for visual feedback when empty -->
        <template #footer v-if="!section.tasks || section.tasks.length === 0">
          <div class="empty-drop-zone"></div>
        </template>
      </draggable>

      <button class="add-task-btn" @click="isTaskFormOpen = true">+ Add Task</button>
    </div>



    <!-- Section Modal -->
    <div v-if="isSectionFormOpen" class="modal">
      <div class="modal-content" ref="sectionModalRef">
        <h3>Add New Section</h3>
        <input v-model="newSectionTitle" placeholder="Section Title" />
        <div class="modal-actions">
          <button @click="cancelAddSection">Cancel</button>
          <button @click="handleAddSection">Add Section</button>
        </div>
      </div>
    </div>

    <TaskForm :open="isTaskFormOpen" @update:open="isTaskFormOpen = $event" @submit="handleAddTask"
      :defaultAssignee="'Current User'" />
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
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

// Refs to modal and menu
const sectionModalRef = ref(null)
const menuRef = ref(null)

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

// === Outside click handling ===
const handleClickOutside = (event) => {
  if (isSectionFormOpen.value && sectionModalRef.value && !sectionModalRef.value.contains(event.target)) {
    isSectionFormOpen.value = false
    newSectionTitle.value = ''
  }
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false
  }
}

watch([isSectionFormOpen, menuOpen], ([formOpen, menuOpenVal]) => {
  if (formOpen || menuOpenVal) {
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
</script>


<style scoped>
.section {
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

.section-box {
  height: 75vh;
  background: #f5f5f573;
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.section-actions-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  outline: none;
}

.empty-drop-zone {
  padding: 12px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
}


.dropdown-menu {
  position: absolute;
  top: 28px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 100;
  min-width: 140px;
  padding: 6px;
  white-space: nowrap;
  /* Prevent text from wrapping */
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
  max-height: 70vh;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 6px;
  overflow-y: scroll;
  scrollbar-width: none;
}

.add-task-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  appearance: none;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  /* slightly smaller */
  line-height: 1.5;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  background-color: transparent;
  color: rgb(162, 165, 171);
  width: 100%;
  margin-top: 6px;
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  /* reduced padding */
  transition: background-color 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.add-task-btn:hover {
  background-color: rgba(25, 118, 210, 0.04);
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
