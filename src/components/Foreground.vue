<template>
  <v-fade-transition mode="out-in">
    <v-img v-show="!hide" src="../assets/background.svg" class="foreground" />
  </v-fade-transition>
</template>

<script>
export default {
  props: ["hide"],
};
</script>

<style scoped>
.foreground {
  position: fixed;
  bottom: 0;
  width: 100vw;
  filter: drop-shadow(0px -3px 10px rgba(0, 0, 0, 0.25));
}
.hideForeground {
  display: none;
}
</style>
