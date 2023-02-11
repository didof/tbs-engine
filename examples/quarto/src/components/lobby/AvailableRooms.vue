<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAvailableRoomsStore, useClient } from "../../store";

const availableRooms = useAvailableRoomsStore();
const client = useClient();

onMounted(async () => {
  await availableRooms.init();
});

const disabled = computed(() => {
  if(!client.isLoggedIn) {
    return true
  }

  return false
})
</script>

<template>
  <section>
    <h2>Rooms</h2>
    <p>There are {{ availableRooms.size }}</p>
    <ul>
      <li v-for="room in availableRooms.list">
        <h3>{{ room.name }}</h3>
        <h4>{{ room.id }}</h4>
        <p>
          {{ room.participants.current.length }}/{{ room.participants.total }}
        </p>
        <button :disabled="disabled">Join</button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1em;
  align-items: center;
}
</style>
