<template>
  <game-interface v-on="$listeners"></game-interface>
</template>

<script>
import GameInterface from "@/components/GameInterface.vue";

export default {
  name: "Home",

  components: {
    GameInterface,
  },

  data: () => ({}),

  computed: {
    appBarHeight() {
      const appBar = document.querySelector("#appbar");

      return appBar.style.height;
    },
  },
};
</script>
