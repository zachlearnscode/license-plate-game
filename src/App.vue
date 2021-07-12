<template>
  <v-app>
    <!-- <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->

    <v-main class="bgTest blue lighten-1">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { _allStates } from "./states.js";

export default {
  name: "App",

  data: () => ({
    allStates: _allStates,
  }),

  created() {
    let query =
      "https://en.wikivoyage.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&inprop=url&titles=";

    //API requires underscore between two-word state names
    let addUnderscore = function (arr) {
      return arr.map((a) => {
        if (a.includes(" ")) {
          let b = a.split("");
          b[b.indexOf(" ")] = "_";
          a = b.join("");
        }

        //These titles direct to optional link pages.
        //Adding 'state' directs to the correct page.
        if (a === "New_York" || a === "Georgia" || a === "Washington") {
          a = a + " (state)";
        }

        return a;
      });
    };

    //Split into batches because API will only return a max of 20 page extracts;
    let group1 = addUnderscore(_allStates.slice(0, 20)),
      group2 = addUnderscore(_allStates.slice(20, 40)),
      group3 = addUnderscore(_allStates.slice(40, 50));

    let allGroups = [group1, group2, group3];

    let queries = allGroups.map((g) => {
      let queryForGroup = query + g.join("|");
      return queryForGroup.slice(0, queryForGroup.length) + "&origin=*";
    });

    queries.forEach((q) => {
      fetch(q)
        .then((response) => response.json())
        .then((data) => console.log(data));
    });
  },
};
</script>

<style scoped>
.bgTest {
  background-size: 150%;
  background-position: bottom;
  background-image: url("./assets/background.svg");
}
</style>
