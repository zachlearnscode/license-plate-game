<template>
  <v-app>
    <v-app-bar id="appbar" app flat color="blue lighten-1" dark>
      <h2>License Plate Hunt</h2>
      <v-spacer></v-spacer>
      <stats-and-filters-dialog
        :sortAndFilter="sortAndFilter"
        :plateCount="plateCount"
        :lastSaved="lastSaved"
        @update-sort-and-filter="sortAndFilter = $event"
        @new-game-requested="createStartState"
      ></stats-and-filters-dialog>
    </v-app-bar>

    <v-main class="blue lighten-1">
      <v-container class="gameInterface">
        <template>
          <transition-group
            tag="div"
            name="translated"
            appear
            @before-enter="beforeEnter"
            @enter="enter"
            @before-leave="beforeLeave"
            @leave="leave"
            move-class="moveClass"
          >
            <state-panel
              v-for="(state, i) in _states"
              :key="state.name"
              :data-idx="i"
              :ref="state.name"
              :state="state"
              :rounded="[i === 0, i === _states.length - 1]"
              @state-toggled="
                [(state.found = !$event), $emit('new-plate-count', plateCount)]
              "
            ></state-panel>
          </transition-group>
        </template>
      </v-container>
      <foreground :hide="hideForeground"></foreground>
    </v-main>
  </v-app>
</template>

<script>
import { _allStates } from "./_allStates.js";
import { _wikidataIds } from "./_wikidataIds.js";

import StatePanel from "./components/StatePanel.vue";
import StatsAndFiltersDialog from "./components/StatsAndFiltersDialog.vue";
import Foreground from "./components/Foreground.vue";

export default {
  name: "App",

  components: {
    Foreground,
    StatePanel,
    StatsAndFiltersDialog,
  },

  data() {
    return {
      states: [],

      sortAndFilter: [0, 0],

      loading: true,
      hideForeground: false,

      intersectionObserver: undefined,
      intersectionObserverTarget: undefined,
      transitioning: false,

      lastSaved: null,
    };
  },

  computed: {
    _states() {
      let result;

      let [sort, filter] = this.sortAndFilter;
      switch (sort) {
        case 0: {
          result = this.states;
          break;
        }
        case 1: {
          result = this.states.slice().reverse();
          break;
        }
        default: {
          result = this.states;
          break;
        }
      }

      switch (filter) {
        case 0: {
          break;
        }
        case 1: {
          result = result.filter((state) => state.found);
          break;
        }
        case 2: {
          result = result.filter((state) => !state.found);
          break;
        }
        default: {
          break;
        }
      }

      return result;
    },

    plateCount() {
      return this.states.filter((state) => state.found).length;
    },
  },

  methods: {
    createStartState() {
      if (this.states.length) {
        this.states = [];
      }

      localStorage.setItem("currentGame", undefined);

      _allStates.forEach((state, i) => {
        this.states.push({
          name: state,
          found: false,
          wikidataId: _wikidataIds[i],
        });
      });
    },
    updateLocalStorage() {
      let strStates = JSON.stringify(this.states);
      localStorage.setItem("currentGame", strStates);

      let date = new Date();
      this.lastSaved = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
    },
    handleIntersect(entries) {
      if (!this.transitioning) {
        entries.forEach((entry) => {
          this.hideForeground = entry.isIntersecting;
        });
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = "translate(0, 5%)";
    },
    enter(el, done) {
      let delay = el.dataset.idx * 50;

      setTimeout(() => {
        el.style.opacity = "100";
        el.style.transform = "translate(0, 0)";
        el.style.transition = "all 250ms ease-in-out";
        done;
      }, delay);
    },
    beforeLeave(el) {
      el.style.opacity = 100;
    },
    leave(el) {
      el.style.opacity = 0;
    },
  },

  watch: {
    states: {
      handler: "updateLocalStorage",
      deep: true,
    },
    _states() {
      this.transitioning = true;
    },
    transitioning() {
      setTimeout(() => (this.transitioning = false), 1000);
    },
    intersectionObserverTarget() {
      this.intersectionObserver.observe(this.intersectionObserverTarget);
    },
  },

  created() {
    if (localStorage.getItem("currentGame")) {
      let parsedStates = JSON.parse(localStorage.getItem("currentGame"));
      return (this.states = parsedStates);
    } else {
      this.createStartState();
    }
  },
  mounted() {
    this.intersectionObserver = new IntersectionObserver(this.handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    let initialTarget = this._states[this._states.length - 1],
      initialTargetEl = this.$refs[`${initialTarget.name}`][0].$el;

    this.intersectionObserverTarget = initialTargetEl;
  },
  beforeUpdate() {
    this.intersectionObserver.unobserve(this.intersectionObserverTarget);
  },
  updated() {
    this.$nextTick(() => {
      if (this._states.length) {
        let newTarget = this._states[this._states.length - 1],
          newTargetEl = this.$refs[`${newTarget.name}`][0].$el;

        this.intersectionObserverTarget = newTargetEl;
        this.intersectionObserver.observe(this.intersectionObserverTarget);
      }
    });
  },
};
</script>

<style>
.gameInterface {
  position: relative;
  overflow: hidden;
}

.translated-leave-active {
  position: absolute;
}

.moveClass {
  transition: all 500ms ease;
}
</style>
