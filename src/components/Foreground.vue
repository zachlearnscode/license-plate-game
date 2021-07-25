<template>
  <v-img v-if="!hide" src="../assets/background.svg" class="foreground" />
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
  width: 100%;
  z-index: 998;
  filter: drop-shadow(0px -3px 10px rgba(0, 0, 0, 0.25));
}
</style>
