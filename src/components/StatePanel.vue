<template>
  <div
    :id="state.idFromName"
    :class="[
      open ? 'my-3 elevation-3' : '',
      rounded[0] ? 'rounded-t' : '',
      rounded[1] ? 'rounded-b' : '',
      state.found ? 'light-green lighten-5' : 'white',
    ]"
    class="smooth"
    style="width: 100%"
  >
    <div class="d-flex justify-space-between align-center pa-3">
      <v-checkbox
        :label="state.name"
        :value="state.found"
        @click="$emit('state-found', state)"
      />
      <v-btn icon @click="open = !open">
        <v-icon :class="open ? 'arrowUp' : ''">mdi-chevron-down</v-icon>
      </v-btn>
    </div>
    <v-expand-transition>
      <div v-show="open" class="pa-3 rounded-b">{{ state.extract }}</div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  props: ["state", "rounded"],

  data: () => ({
    open: false,
  }),

  mounted() {
    let panelWidth = document.querySelector(".smooth").offsetWidth;
    return this.$emit("panels-mounted", panelWidth);
  },
};
</script>

<style scoped>
.smooth {
  transition: all 300ms ease-in-out;
}
.arrowUp {
  transform: rotate(-0.5turn);
}
</style>
