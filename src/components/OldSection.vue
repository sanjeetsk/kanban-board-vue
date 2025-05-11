<template>
  <div class="section" :class="{ 'section--hover': isOver }" ref="dropZone">
    <div class="section-header">
      <h6 class="section-title">{{ section.name }}</h6>
      <div class="section-actions">
        <button @click="openAddTaskForm">+</button>
        <button @click="openMenu">⋮</button>
      </div>
    </div>

    <div class="section-tasks">
      <div v-if="!section.tasks || section.tasks.length === 0">
        <button class="add-task-button" @click="openAddTaskForm">+ Add Task</button>
      </div>
      <div v-else>
        <TaskCard
          v-for="task in section.tasks"
          :key="task._id"
          :task="task"
          :sectionId="section._id"
        />
        <button class="add-task-button" @click="openAddTaskForm">+ Add Task</button>
      </div>
    </div>

    <!-- Add Section Dialog -->
    <div v-if="isSectionFormOpen" class="dialog">
      <h3>Add New Section</h3>
      <input v-model="newSectionTitle" placeholder="Section Title" />
      <div class="dialog-actions">
        <button @click="closeSectionForm">Cancel</button>
        <button @click="handleAddSection">Add Section</button>
      </div>
    </div>

    <!-- Add Task Dialog -->
    <TaskForm
      v-if="isTaskFormOpen"
      :open="isTaskFormOpen"
      @close="closeTaskForm"
      @submit="handleAddTask"
      :defaultAssignee="'Current User'"
    />
  </div>
</template>

<script>
import TaskCard from './TaskCard.vue';
import TaskForm from './TaskForm.vue';

export default {
  name: 'Section',
  components: {
    TaskCard,
    TaskForm
  },
  props: {
    section: Object
  },
  data() {
    return {
      isTaskFormOpen: false,
      isSectionFormOpen: false,
      newSectionTitle: '',
      isOver: false
    };
  },
  methods: {
    openAddTaskForm() {
      this.isTaskFormOpen = true;
    },
    closeTaskForm() {
      this.isTaskFormOpen = false;
    },
    openMenu() {
      // Implement menu logic
    },
    openSectionForm() {
      this.isSectionFormOpen = true;
    },
    closeSectionForm() {
      this.isSectionFormOpen = false;
      this.newSectionTitle = '';
    },
    handleAddSection() {
      if (this.newSectionTitle.trim() !== '') {
        const sectionData = {
          name: this.newSectionTitle,
          selectedSectionId: this.section._id
        };
        // Dispatch addSection action
        this.newSectionTitle = '';
        this.isSectionFormOpen = false;
      }
    },
    handleAddTask(taskData) {
      const newTask = { ...taskData, section: this.section._id };
      // Dispatch addTask action
    }
  },
  mounted() {
    // Implement drag-and-drop logic if needed
  }
};
</script>

<style scoped>
.section {
  background-color: white;
  padding: 16px;
  transition: opacity 0.15s ease;
  will-change: opacity;
  transform: translate3d(0, 0, 0);
}
.section--hover {
  opacity: 0.7;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-title {
  font-size: 1rem;
  font-weight: bold;
}
.section-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
.section-tasks {
  margin-top: 8px;
  height: 95%;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 8px;
  min-height: 200px;
  transform: translate3d(0, 0, 0);
}
.add-task-button {
  background: none;
  border: none;
  color: #a2a5ab;
  margin-top: 8px;
  cursor: pointer;
}
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>


