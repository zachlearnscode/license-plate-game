<template>
  <div
    class="dialogContainer d-flex flex-column"
    v-touch="{
      down: () => evaluateClose(),
    }"
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
        style="width: 100%; max-height: 50vh"
      >
        <v-container
          class="white pa-4"
          style="
            width: 95%;
            height: 200%;
            margin-top: 5px;
            filter: drop-shadow(1px 0px 5px rgba(0, 0, 0, 0.2));
          "
        >
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <h2>Stats & Filters</h2>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <v-col cols="auto">
              <span class="font-weight-bold">Plate Count</span>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-progress-linear
                :value="(plateCount / 50) * 100"
                height="1.5rem"
                class="align-self-end"
                color="light-green"
                rounded
                >{{ plateCount }}</v-progress-linear
              >
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <v-col cols="auto">
              <span class="font-weight-bold">Sort By</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <v-btn-toggle
                :value="sortAndFilterOptions[0]"
                @change="$emit('sort-changed', $event)"
                mandatory
              >
                <v-btn>
                  <v-icon>mdi-order-alphabetical-ascending</v-icon>
                </v-btn>

                <v-btn>
                  <v-icon>mdi-order-alphabetical-descending</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <v-col cols="auto">
              <span class="font-weight-bold">Filter By</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <v-btn-toggle
                :value="sortAndFilterOptions[1]"
                @change="$emit('filter-changed', $event)"
                mandatory
              >
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
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  props: ["sortAndFilterOptions", "plateCount", "width"],

  data() {
    return {
      open: false,

      panelWidth: null,
      panelRight: null,
    };
  },

  methods: {
    evaluateClose() {
      if (this.open) {
        return (this.open = false);
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      let main = document.querySelector(".gameInterface");
      let mainStyles = getComputedStyle(main);
      let mainMargin = mainStyles.marginRight.slice(
        0,
        mainStyles.marginRight.indexOf("px")
      );
      let mainPadding = mainStyles.paddingRight.slice(
        0,
        mainStyles.paddingRight.indexOf("px")
      );

      this.panelWidth = document.querySelector(".panel").offsetWidth + 12;
      this.panelRight = Number(mainMargin) + Number(mainPadding);
    });
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
  transition: all 300ms ease;
  width: 100vw;
  filter: drop-shadow(0px 10px 40px rgba(0, 0, 0, 0.5));
}
</style>
