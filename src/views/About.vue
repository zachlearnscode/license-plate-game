<template>

    <v-container style="height:50vh;overflow:hidden;" class="px-0">
      <transition-group name="translated" tag="div" style="position:relative;">
        <v-row v-for="num in display" :key="num" class="panel my-1 mx-auto" style="width:100%;">
          <v-col>{{num}}</v-col>
        </v-row>
      </transition-group>

      <v-btn @click="filter = !filter">Click Me!</v-btn>

    </v-container>

    

</template>

<script>
export default {
  data() {
    return {
      arr: [1,2,3,4,5],
      filter: false
    }
  },

  computed: {
    display() {
      if (this.filter) {
        return this.arr.filter(num => num % 2 === 0);
      } else {
        return this.arr;
      }
    }
  }
}
</script>

<style>
.panel {
  background: white;
}
.translated-enter-active  {
  transition: all 1s ease;
}
.translated-leave-active {
  position: absolute;
}
.translated-leave {
  opacity: 1;
}
.translated-enter, .translated-leave-to {
  transform:translateX(100%);
  opacity: 0;
}
.translated-move {
  transition: all 1s ease;
}
</style>
