<template>
  <div class="board">
    <!-- Top Navbar -->
    <header class="navbar">
      <div class="navbar-left">
        <button v-if="isMobile" class="icon-btn" @click="mobileMenuOpen = true">☰</button>
        <span class="logo"><img :src="appleLogo" alt="Apple Logo" /></span>
        <div v-if="!isMobile" class="title-info">
          <p class="title">Kanban Board</p>
          <p class="subtitle">{{ sections.length }} boards • {{ userCount }} members</p>
        </div>
      </div>

      <div class="navbar-right">
        <div v-if="!isMobile" class="search-bar">
          <input type="text" placeholder="Search" v-model="searchQuery" class="mui-search-input" />
        </div>
        <div>
          <button v-if="!token" class="auth-btn" @click="isAuthFormOpen = true">Sign Up / Login</button>
          <div v-else class="user-avatar" @click="toggleUserMenu">
            <img v-if="userPhoto" :src="userPhoto" :alt="user?.name" class="avatar-img" />
            <span v-else class="avatar-placeholder">{{ user?.name?.[0]?.toUpperCase() || '?' }}</span>
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
      <input type="text" placeholder="Search" v-model="searchQuery" class="search-input" />
      <p class="subtitle">{{ sections.length }} boards • {{ userCount }} members</p>
      <button @click="mobileMenuOpen = false">Close</button>
    </div>

    <!-- Board Content -->
    <div class="board-content">
      <div v-for="section in sections" :key="section._id" class="section-container">
        <Section :section="section" />
      </div>
      <div class="add-section-button">
        <button @click="isSectionFormOpen = true"><span class="plus">+</span>&nbsp; Add Section</button>
      </div>
    </div>


    <!-- Add Section Modal -->
    <div v-if="isSectionFormOpen" ref="modalRef" class="modal">
      <div class="modal-content">
        <h3>Add New Section</h3>
        <input v-model="newSectionTitle" placeholder="Section Title" class="modal-input" />
        <div class="modal-actions">
          <button @click="isSectionFormOpen = false">Cancel</button>
          <button @click="handleAddSection">Add Section</button>
        </div>
      </div>
    </div>

    <!-- <AuthForm :open="isAuthFormOpen" @close="isAuthFormOpen = false" />
    <AuthForm :open="isAuthFormOpen" @update:open="isAuthFormOpen = $event" />
    <LoadingScreen v-if="loading" /> -->
  </div>
</template>


<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useKanbanStore } from '../store/useKanbanStore';
import { useAuthStore } from '../store/useAuthStore';
import Section from './Section.vue';
import AuthForm from './AuthForm.vue';
import LoadingScreen from './LoadingScreen.vue';
import appleLogo from '../assets/apple-logo.png';

const kanbanStore = useKanbanStore();
const authStore = useAuthStore();

const sections = computed(() => kanbanStore.sections)
const {
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
const isAddSectionModalOpen = ref(false)
const modalRef = ref(null)

const isMobile = computed(() => window.innerWidth <= 600);

const handleAddSection = () => {
  if (newSectionTitle.value.trim()) {
    addSection({ name: newSectionTitle.value });
    newSectionTitle.value = '';
    isSectionFormOpen.value = false;
  }
};

const handleClickOutside = (e) => {
  if (modalRef.value && !modalRef.value.contains(e.target)) {
    isAddSectionModalOpen.value = false
  }
}


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


onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.board {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  /* background-color: #f4f6f8; */
  background-color: white;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: black;
  padding: 0.75rem 1rem;
  box-shadow: none;
  border-bottom: 1px solid #ddd;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-info .title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.title-info .subtitle {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

.logo {
  font-size: 1.5rem;
}

.logo img {
  width: 32px;
  height: 32px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.mui-search-input {
  background-color: #f4f5f7;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  width: 200px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}

.mui-search-input:focus {
  outline: none;
  border-color: #999;
}

.auth-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.user-avatar {
  position: relative;
  cursor: pointer;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #999;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  padding: 8px;
  margin-top: 4px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.mobile-drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: white;
  padding: 16px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.board-content {
  flex: 1;
  display: flex;
  overflow-x: auto;
  padding: 10px;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgb(209, 213, 219) transparent;
}

.add-section-button{
  margin-top: 5px;
}

.add-section-button button {
  width: 150px;
  background-color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #000000ae;
}

.add-section-button button:hover {
  background-color: #f0f0f0;
}

.plus{
  font-size: 1.1rem;
  font-weight: bold;
  color: #000000ae;
}

.section-container{
height: calc(-84px + 100vh);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.modal-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
