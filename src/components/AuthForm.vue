<template>
  <v-dialog :model-value="props.open" @update:modelValue="emit('update:open', $event)" persistent>
    <v-card>
      <v-card-title>{{ isLogin ? "Login" : "Sign Up" }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-if="!isLogin" v-model="form.name" label="Name" required />
          <v-text-field v-if="!isLogin" v-model="form.userPhoto" label="Photo URL (optional)" />
          <v-text-field v-model="form.email" label="Email" type="email" required />
          <v-text-field v-model="form.password" label="Password" type="password" required />
          <v-alert type="error" v-if="authStore.error">{{ authStore.error }}</v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <v-btn :loading="authStore.loading" @click="handleSubmit" block>{{ isLogin ? "Login" : "Sign Up" }}</v-btn>
        <v-btn @click="toggleMode" variant="text" block>
          {{ isLogin ? "Create an account" : "Already have an account?" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useAuthStore } from '../store/useAuthStore'

// Define props
const props = defineProps({
  open: Boolean,
  handleClose: Function
})

// Define emit
const emit = defineEmits(['update:open'])

const authStore = useAuthStore()

const form = ref({ name: '', email: '', password: '', userPhoto: '' })
const isLogin = ref(true)

const resetForm = () => {
  form.value = { name: '', email: '', password: '', userPhoto: '' }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const handleSubmit = () => {
  if (isLogin.value) {
    authStore.login({ email: form.value.email, password: form.value.password })
  } else {
    authStore.signup(form.value)
  }
}

watch(() => authStore.signupSuccess, (val) => {
  if (val) {
    isLogin.value = true
    form.value = { ...form.value, password: '', name: '', userPhoto: '' }
  }
})

watch(() => authStore.token, (token) => {
  if (token) {
    resetForm()
    emit('update:open', false) // ✅ use emit instead of props.handleClose()
  }
})
</script>
