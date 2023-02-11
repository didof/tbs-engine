<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Nullable } from "../../utils/types";
import { useAvailableRoomsStore, useClient } from "../../store";

const availableRooms = useAvailableRoomsStore();
const client = useClient();

const username = ref("didof");
const gamename = ref("test");

const focusStartElement = ref<Nullable<HTMLElement>>(null);

onMounted(() => {
  focusStartElement.value!.focus();
});

const disabled = computed(() => {
  if (!client.isLoggedIn) {
    return true;
  }

  if (username.value.length < 3 || gamename.value.length < 3) {
    return true;
  }
});
</script>

<template>
  <section>
    <h2>New game</h2>
    <form @submit.prevent="availableRooms.create(username, gamename)">
      <div>
        <label for="gamename">gamename</label>
        <input type="text" name="gamename" id="gamename" v-model="gamename" ref="focusStartElement"/>
      </div>

      <button :disabled="disabled">Create</button>
    </form>
  </section>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

form div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
</style>
