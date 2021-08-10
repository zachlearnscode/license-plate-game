<template>
  <v-app>
    <v-app-bar id="appbar" app flat color="blue lighten-1" dark>
      <h2>The License Plate Game</h2>
    </v-app-bar>

    <v-main class="blue lighten-1">
      <router-view @intersection="hideForeground = $event" />
      <foreground :hide="hideForeground"></foreground>
    </v-main>
  </v-app>
</template>

<script>
import Foreground from "./components/Foreground.vue";

export default {
  name: "App",

  components: {
    Foreground,
  },

  data() {
    return {
      hideForeground: false,
    };
  },

  computed: {},
};
</script>

<style></style>
