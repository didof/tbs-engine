<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useClient } from "../../store";
import { Nullable } from "../../utils/types";

const name = ref("");
const password = ref("");

const focusElement = ref<Nullable<HTMLElement>>(null);
onMounted(() => {
  focusElement.value?.focus();
});

const disabled = computed(() => {
  return (
    name.value.length < 3 ||
    password.value.length < 8 ||
    password.value.length > 40
  );
});

const client = useClient();
</script>

<template>
  <section>
    <button v-if="client.isLoggedIn" @click="client.logout">Logout</button>
    <form v-else @submit.prevent="client.login(name, password)">
      <div>
        <label for="name" style="display: none">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          v-model="name"
          ref="focusElement"
          placeholder="name"
        />
      </div>

      <div>
        <label for="password" style="display: none">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          min="8"
          max="40"
          placeholder="password"
        />
      </div>

      <button :disabled="disabled">Login</button>
    </form>
  </section>
</template>

<style scoped>
form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
</style>
