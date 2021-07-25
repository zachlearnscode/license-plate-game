<template>
  <div
    class="dialogContainer d-flex flex-column"
    :style="{ width: width + 6 + 'px' }"
    style="filter: drop-shadow(0px 10px 40px rgba(0, 0, 0, 0.5))"
  >
    <div
      class="
        align-self-end
        d-flex
        align-center
        justify-center
        py-1
        rounded-t-lg
        amber
        lighten-3
      "
      style="width: 30%"
    >
      <v-icon @click="open = !open" :class="open ? 'arrowDown' : ''"
        >mdi-chevron-up</v-icon
      >
    </div>
    <v-expand-transition>
      <div
        v-if="open"
        class="amber lighten-3 rounded-tl-lg pt-3 px-3 d-flex justify-center"
        style="width: 100%; height: 50vh"
      >
        <v-container
          class="white pa-3"
          style="
            width: 90%;
            height: 150%;
            margin-top: 5px;
            transform: rotate(2deg);
            filter: drop-shadow(1px 0px 5px rgba(0, 0, 0, 0.2));
            overflow-y: scroll;
          "
        >
          <v-row>
            <v-col cols="12">
              <h2>Stats & Filters</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-column">
                <span>Plate Count</span>
                <v-progress-linear
                  :value="(plateCount / 50) * 100"
                  height="1.5rem"
                  color="light-green"
                  rounded
                  >{{ plateCount }}</v-progress-linear
                >
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-column">
                <span>Sort By</span>
                <v-btn-toggle v-model="toggle_sort">
                  <v-btn>
                    <v-icon>mdi-order-alphabetical-ascending</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-order-alphabetical-descending</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-order-bool-descending-variant</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-column">
                <span>Filter By</span>
                <v-btn-toggle v-model="toggle_filter">
                  <v-btn>
                    <v-icon>mdi-alpha-a</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-check-bold</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-crop-square</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  props: ["plateCount", "width", "sortAndFilter"],

  data() {
    return {
      open: false,
      toggle_sort: this.sortAndFilter[0],
      toggle_filter: this.sortAndFilter[1],
    };
  },

  watch: {
    toggle_sort: function () {
      return this.$emit("reorder", [this.toggle_sort, this.toggle_filter]);
    },
    toggle_filter: function () {
      return this.$emit("reorder", [this.toggle_sort, this.toggle_filter]);
    },
  },
};
</script>

<style scoped>
.arrowDown {
  transform: rotate(0.5turn);
}
.dialogContainer {
  position: fixed;
  bottom: 0;
  padding: 0;
  z-index: 9999;
  opacity: 1;
  transition: all 300ms ease;
}
</style>
