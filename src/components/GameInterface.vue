<template>
  <v-container
    class="gameInterface"
    :style="{ 'min-height': `calc(100vh - ${appbarHeight}px)` }"
  >
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
</template>

<script>
import { _allStates } from "../_allStates.js";
import { _wikidataIds } from "../_wikidataIds.js";

import StatePanel from "./StatePanel.vue";

export default {
  props: ["sort", "filter"],

  components: {
    StatePanel,
  },

  data() {
    return {
      states: [],

      loading: true,
      panelsMounted: false,

      intersectionObserver: undefined,
      intersectionObserverTarget: undefined,
      transitioning: false,
    };
  },

  computed: {
    _states() {
      let result;

      switch (this.sort) {
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

      switch (this.filter) {
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

    appbarHeight() {
      if (this.$vuetify.breakpoint.name === "xs") {
        return 56;
      }

      return 64;
    },
  },

  methods: {
    handleIntersect(entries) {
      if (!this.transitioning) {
        entries.forEach((entry) => {
          this.$emit("intersection", entry.isIntersecting);
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
    if (!this.states.length) {
      _allStates.forEach((state, i) => {
        this.states.push({
          name: state,
          found: false,
          wikidataId: _wikidataIds[i],
        });
      });
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
  transition: all 500ms ease -250ms;
}
</style>
