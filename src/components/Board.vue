<template>
  <div class="board">
    <!-- Top Navbar -->
    <header class="navbar">
      <div class="navbar-left">
        <button v-if="isMobile" class="icon-btn" @click="mobileMenuOpen = true">
          <MenuIcon />
        </button>
        <AppleIcon class="logo" />
        <div v-if="!isMobile" class="title-info">
          <p class="title">Kanban Board</p>
          <p class="subtitle">{{ sections.length }} boards • {{ userCount }} members</p>
        </div>
      </div>

      <div class="navbar-right">
        <div v-if="!isMobile" class="search-bar">
          <input
            type="text"
            placeholder="Search"
            v-model="searchQuery"
            class="search-input"
          />
        </div>
        <div>
          <button
            v-if="!token"
            class="auth-btn"
            @click="isAuthFormOpen = true"
          >
            Sign Up / Login
          </button>
          <div v-else class="user-avatar" @click="toggleUserMenu">
            <img
              :src="userPhoto"
              v-if="userPhoto"
              :alt="user?.name"
              class="avatar-img"
            />
            <span v-else class="avatar-placeholder">
              {{ user?.name?.[0]?.toUpperCase() || '?' }}
            </span>
            <div v-if="userMenuOpen" class="user-menu">
              <p>{{ user?.name }}</p>
              <button @click="logoutUser">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Drawer -->
    <div v-if="mobileMenuOpen" class="mobile-drawer">
      <p class="title">Kanban Board</p>
      <input
        type="text"
        placeholder="Search"
        v-model="searchQuery"
        class="search-input"
      />
      <p class="subtitle">{{ sections.length }} boards • {{ userCount }} members</p>
      <button @click="mobileMenuOpen = false">Close</button>
    </div>

    <!-- Board Content -->
    <div class="board-content">
      <div
        v-for="section in sections"
        :key="section._id"
        class="section-container"
      >
        <Section :section="section" />
      </div>
      <div class="add-section-button">
        <button @click="isSectionFormOpen = true">
          <AddIcon /> Add Section
        </button>
      </div>
    </div>

    <!-- Add Section Modal -->
    <div v-if="isSectionFormOpen" class="modal">
      <div class="modal-content">
        <h3>Add New Section</h3>
        <input
          v-model="newSectionTitle"
          placeholder="Section Title"
          class="modal-input"
        />
        <div class="modal-actions">
          <button @click="isSectionFormOpen = false">Cancel</button>
          <button @click="handleAddSection">Add Section</button>
        </div>
      </div>
    </div>

    <!-- AuthForm Modal -->
    <AuthForm :open="isAuthFormOpen" @close="isAuthFormOpen = false" />

    <LoadingScreen v-if="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useKanbanStore } from '../store/kanban';
import { useAuthStore } from '../store/auth';
import Section from './Section.vue';
import AuthForm from './AuthForm.vue';
import LoadingScreen from './LoadingScreen.vue';

import AppleIcon from '@mui/icons-material/Apple';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';

const kanbanStore = useKanbanStore();
const authStore = useAuthStore();

const {
  sections,
  loading,
  fetchSections,
  addSection,
} = kanbanStore;

const {
  token,
  user,
  userPhoto,
  userCount,
  fetchCurrentUser,
  logoutUser,
  fetchUserCount
} = authStore;

const searchQuery = ref('');
const newSectionTitle = ref('');
const isSectionFormOpen = ref(false);
const isAuthFormOpen = ref(false);
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

const isMobile = computed(() => window.innerWidth <= 600);

const handleAddSection = () => {
  if (newSectionTitle.value.trim()) {
    addSection({ name: newSectionTitle.value });
    newSectionTitle.value = '';
    isSectionFormOpen.value = false;
  }
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

onMounted(() => {
  fetchSections();
  fetchUserCount();

  if (token && !user) {
    fetchCurrentUser();
  }
});
</script>

<style scoped>
/* Add your plain CSS here */
.board {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-bottom: 1px solid #eee;
}
.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.title-info {
  display: flex;
  flex-direction: column;
}
.search-bar {
  background: #f4f5f7;
  border-radius: 5px;
}
.search-input {
  padding: 6px 10px;
  border: none;
  width: 200px;
}
.auth-btn {
  background: #1976d2;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
}
.user-avatar {
  position: relative;
  cursor: pointer;
}
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: gray;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-menu {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  padding: 10px;
  border-radius: 4px;
}
.mobile-drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  background: white;
  padding: 10px;
  z-index: 10;
}
.board-content {
  flex: 1;
  display: flex;
  overflow-x: auto;
  padding: 10px;
}
.section-container {
  min-width: 300px;
  margin-right: 10px;
}
.add-section-button {
  display: flex;
  align-items: center;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 300px;
}
.modal-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
}
.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
