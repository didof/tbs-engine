<script setup lang="ts">
import NewGame from "../components/lobby/NewGame.vue";
import AvailableRooms from "../components/lobby/AvailableRooms.vue";
</script>

<template>
  <main>
    <NewGame />
    <AvailableRooms />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  justify-content: space-around;
  display: flex;
}
</style>
