<template>
  <v-app>
    <v-app-bar id="appbar" app flat color="blue lighten-1" dark>
      <h2>The License Plate Game</h2>
    </v-app-bar>

    <v-main class="blue lighten-1">
      <router-view @intersection="hideForeground = $event" />
      <transition name="fade">
        <foreground :hide="hideForeground"></foreground>
      </transition>
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
      blur: false,
    };
  },

  computed: {},
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
