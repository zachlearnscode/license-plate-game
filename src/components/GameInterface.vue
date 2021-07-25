<template>
  <v-container>
    <template v-if="!loading">
      <state-panel
        v-for="(state, i) in display"
        :key="state.name"
        :state="state"
        :rounded="[i === 0, i === display.length - 1]"
        @state-found="$event.found = !$event.found"
      ></state-panel>
      <!-- <stats-and-filters-dialog :plateCount="plateCount" @reorder="sortAndFilter=$event"/> -->
    </template>
  </v-container>
</template>

<script>
//import { _allStates } from "../_allStates.js";
import { _stateObjects } from "../_stateObjects.js";
import { _queries } from "../wikiVoyageQuery.js";

import StatePanel from "./StatePanel.vue";
// import StatsAndFiltersDialog from "./StatsAndFiltersDialog.vue";

export default {
  components: {
    StatePanel,
    // StatsAndFiltersDialog,
  },

  data() {
    return {
      states: _stateObjects,

      loading: true,
      sortAndFilter: [0, 0],

      intersectionObserver: undefined,
    };
  },

  computed: {
    display() {
      let result = this.states.slice();

      if (this.sortAndFilter[1] == 1) {
        result = result.filter((state) => state.found);
      } else if (this.sortAndFilter[1] == 2) {
        result = result.filter((state) => !state.found);
      }

      if (this.sortAndFilter[0] == 1) {
        result = result.reverse();
      } else if (this.sortAndFilter[0] == 2) {
        result = result.sort((a, b) => b - a);
      }

      return result;
    },
    intersectionObserverTarget() {
      return `#${this.display[this.display.length - 1].idFromName}`;
    },
  },

  methods: {
    handleIntersect(entries) {
      entries.forEach((entry) => {
        this.$emit("intersection", entry.isIntersecting);
      });
    },
  },

  watch: {
    loading: function () {
      this.$nextTick(() => {
        const options = { root: null, rootMargin: "0px", threshold: 0.1 };
        this.intersectionObserver = new IntersectionObserver(
          this.handleIntersect,
          options
        );

        let target = document.querySelector(this.intersectionObserverTarget);
        this.intersectionObserver.observe(target);
      });
    },
  },

  created() {
    //Fetch data from API. _queries imported above.
    Promise.all(_queries.map((q) => fetch(q)))
      .then((res) => {
        let jsonData = res.map((i) => i.json());
        return Promise.all(jsonData);
      })
      .then((data) => {
        let results = data.reduce((a, b) => a.concat(b.query.pages), []);

        this.states.forEach((state) => {
          let fetchedStateData = results.find(
            (result) =>
              result.title === state.name ||
              result.title === state.name + " (state)"
          );

          state.extract = fetchedStateData.extract;
          state.fullurl = fetchedStateData.fullurl;
        });

        this.loading = false;
        //return (this.fetchedData_private = result);
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style></style>
