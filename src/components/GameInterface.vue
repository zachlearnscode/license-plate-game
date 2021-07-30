<template>
  <v-container class="gameInterface" :style="{'min-height': `calc(100vh - ${appbarHeight}px)`}">
    <template v-if="!loading">
      <transition-group name="translated" tag="div" :css="false" appear @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <state-panel
          v-for="(state, i) in display"
          :data-idx="i"
          :key="state.idFromName"   
          :state="state"
          :rounded="[i === 0, i === display.length - 1]"
          @state-found="toggleFoundStatus($event)"
        ></state-panel>
      </transition-group>
    </template>
    <transition enter-active-class="animate__animated animate__fadeIn">
      <stats-and-filters-dialog v-if="panelsMounted" :plateCount="plateCount" :sortAndFilter="sortAndFilter" @reorder="sortAndFilter=$event"/>
    </transition>
  </v-container>
</template>

<script>
import { _stateObjects } from "../_stateObjects.js";
import { _queries } from "../wikiVoyageQuery.js";

import StatePanel from "./StatePanel.vue";
import StatsAndFiltersDialog from "./StatsAndFiltersDialog.vue";

export default {
  components: {
    StatePanel,
    StatsAndFiltersDialog,
  },

  data() {
    return {
      states: _stateObjects,
      sortAndFilter: [0, 0],

      loading: true,
      panelsMounted: false,

      intersectionObserver: undefined,
      intersectionObserverTarget: undefined,
      transitioning: false
    };
  },

  computed: {
    display() {
      let [sort, filter] = this.sortAndFilter;

      if (sort === 0 && filter === 0) {
        return this.states;
      } else if (sort === 0 && filter === 1) {
        return this.states.filter(s => s.found);
      } else if (sort === 0 && filter === 2) {
        return this.states.filter(s => !s.found);
      } else if (sort === 1 && filter === 0) {
        return this.states.slice().reverse();
      } else if (sort === 1 && filter === 1) {
        return this.states.filter(s => s.found).reverse();
      } else if (sort === 1 && filter === 2) {
        return this.states.filter(s => !s.found).reverse();
      }
    },

    plateCount() {
      return this.states.filter(state => state.found).length;
    },

    appbarHeight() {
      if (this.$vuetify.breakpoint.name === 'xs') {
        return 56;
      }

      return 64;
    }
  },

  methods: {
    testFn(event) {
      console.log(event)
    },
    enter(el, done) {
      let delay = el.dataset.idx * 100;

      setTimeout(() => {
        el.style.opacity = "100";
        el.style.transform = "translate(0, 0)"
        el.style.transition = "all 250ms ease-in-out";
        done();
      }, delay)
    },
    toggleFoundStatus(state) {
      state.found = !state.found;
    },
    handleIntersect(entries) {
      if (!this.transitioning) {
        entries.forEach(entry => {
          this.$emit('intersection', entry.isIntersecting);
        })
      }
    },
    getIntersectionOberserverTargetID() {
      return `#${this.display[this.display.length - 1].idFromName}`;
    },
    beforeEnter(el) {
      this.$nextTick(() => {
        if (el.dataset.idx == 0) this.transitioning = true
      });

      el.style.opacity = 0;
      el.style.transform = "translate(0, 5%)"
    },
    afterEnter(el) {
      this.$nextTick(() => {
        if (el.dataset.idx == this.display.length - 1) this.transitioning = false
      });
    }
  },

  watch: {
    loading: function () {
      this.$nextTick(() => {
        setTimeout(() => this.panelsMounted = true, 500);
      });
    },
    display() {
      this.transitioning = true;
    },
    transitioning() {
      setTimeout(() => this.transitioning = false, 1000)
    }
  },

  created() {
    const options = { root: null, rootMargin: "0px", threshold: 1 };
    
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersect,
      options
    );
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
      })
      .catch((err) => console.log(err));
  },
  updated() {
    let newTarget = this.display[this.display.length - 1],
        newTargetEl = document.querySelector(`#${newTarget.idFromName}`);
        
    if (this.intersectionObserverTarget) {
      if (this.intersectionObserverTarget !== newTargetEl) {
          this.intersectionObserver.unobserve(this.intersectionObserverTarget);
      }
    }

    this.intersectionObserverTarget = newTargetEl;
    this.intersectionObserver.observe(this.intersectionObserverTarget);
  }
};
</script>

<style>
.gameInterface {
  position: relative;
  overflow: hidden;
}
.translated-enter-active  {
  transition: all 1s ease;
}
.translated-leave-active {
  transition: all 1s ease;
  position: absolute;
}
/* .translated-enter {
  transform:translate(100%, 0);
} */

.translated-enter, .translated-leave-to {
  opacity: 0;
}
.translated-move {
  transition: none 350ms ease-in;

}
</style>
