<template>
  <v-container>
    <v-expansion-panels>
      <state-panel
        v-for="(state, i) in stateObjects"
        :key="i"
        :name="state.name"
        :found="state.found"
        :description="state.extract"
        :url="state.fullurl"
      ></state-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import StatePanel from "./StatePanel.vue";

export default {
  props: ["stateObjects"],

  components: { StatePanel },
};
</script>

<style></style>
