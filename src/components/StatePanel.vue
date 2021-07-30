<template>
  <v-container
    :id="state.idFromName"
    :class="{
      'my-3 elevation-3': open,
      'rounded-t': rounded[0],
      'rounded-b': rounded[1],
      'white': !state.found,
      'light-green lighten-5': state.found
    }"
    class="panel"
  >
    <v-row class="d-flex justify-space-between align-center pa-3">
      <v-col cols="auto">
        <v-checkbox
          :label="state.name"
          :input-value="state.found"
          @click="$emit('state-found', state)"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn icon @click="open = !open">
          <v-icon :class="{'arrowUp': open}">mdi-chevron-down</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-row v-show="open" class="pa-3">
        <v-col>{{ state.extract }}</v-col>
      </v-row>
    </v-expand-transition>
  </v-container>
</template>

<script>
export default {
  props: ["state", "rounded"],

  data: () => ({
    open: false,
  }),
};
</script>

<style>
.arrowUp {
  transform: rotate(-0.5turn);
}
</style>
