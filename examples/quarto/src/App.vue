<script setup lang="ts">
import { RouterView } from "vue-router";
import Login from "./components/shell/Login.vue";
</script>

<template>
  <header>
    <router-link to="/">Lobby</router-link>

    <Login />
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background-color: black;
}
</style>