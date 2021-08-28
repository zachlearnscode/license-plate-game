<template>
  <v-dialog
    origin="top center"
    max-width="500px"
    transition="scroll-y-transition"
    v-model="open"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="white" icon v-bind="attrs" v-on="on">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Info & Options</span>
        <v-spacer></v-spacer>
        <v-card-actions class="pr-0"
          ><v-btn icon @click="open = false" class="pr-0"
            ><v-icon>mdi-close</v-icon></v-btn
          ></v-card-actions
        >
      </v-card-title>
      <v-card-text max-height="500px">
        <v-container fluid class="white px-0">
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
              <span class="font-weight-bold">Sort</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <v-btn-toggle
                :value="sortAndFilter[0]"
                @change="
                  $emit('update-sort-and-filter', [$event, sortAndFilter[1]])
                "
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
              <span class="font-weight-bold">Filter</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <v-btn-toggle
                :value="sortAndFilter[1]"
                @change="
                  $emit('update-sort-and-filter', [sortAndFilter[0], $event])
                "
                mandatory
              >
                <v-btn>
                  <v-icon>mdi-alpha-a</v-icon>
                </v-btn>

                <v-btn :disabled="plateCount < 1">
                  <v-icon>mdi-check-bold</v-icon>
                </v-btn>

                <v-btn :disabled="plateCount < 1">
                  <v-icon>mdi-crop-square</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex align-center">
              <span class="font-weight-bold">Start New Game</span>
              <v-spacer></v-spacer>
              <div class="d-flex align-center">
                <v-checkbox v-model="checkbox" class="ml-1"></v-checkbox>
                <v-btn
                  :disabled="!checkbox"
                  :dark="checkbox"
                  color="red"
                  @click="[$emit('new-game-requested'), (open = false)]"
                >
                  Confirm
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center">Last Saved: {{ lastSaved }}</v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["sortAndFilter", "plateCount", "lastSaved"],

  data() {
    return {
      open: false,
      checkbox: false,
    };
  },

  watch: {
    open() {
      if (!this.open) {
        if (this.checkbox) {
          return (this.checkbox = false);
        }
      }
    },
  },
};
</script>
