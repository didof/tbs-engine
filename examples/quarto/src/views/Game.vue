<script setup lang="ts">
import { useGame } from "../store";

const game = useGame()!;
</script>

<template>
  <div>
    <h1>Game {{ game.value!.id }}</h1>

    <p>
      Participants: {{ game!.value!.participants.current.length }} /
      {{ game!.value!.participants.total }}
    </p>

    <ul>
      <li v-for="participant of game!.value!.participants.current">
        {{ participant.name }}
      </li>
    </ul>

    <button v-if="true">Start</button>
  </div>
</template>

<style scoped></style>
