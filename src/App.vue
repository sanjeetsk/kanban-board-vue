<template>
  <DndProvider :backend="HTML5Backend">
    <Board />
  </DndProvider>
</template>

<script setup>
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Board from './components/Board.vue'
</script>
