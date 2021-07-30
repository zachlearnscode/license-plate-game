<template>
<transition name="fade">
  <v-img v-if="!hide" src="../assets/background.svg" class="foreground"/>
</transition>
</template>

<script>
export default {
  props: ["hide"]
};
</script>

<style scoped>
.foreground {
  position: fixed;
  bottom: 0;
  width: 100vw;
  filter: drop-shadow(0px -3px 10px rgba(0, 0, 0, 0.25));
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
