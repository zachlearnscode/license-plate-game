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
import { _allStates } from "./_allStates.js";
import { _stateObjects } from "./_stateObjects.js";

export default {
  name: "App",

  data: () => ({
    stateObjects: _stateObjects,
    fetchedData: undefined,
  }),

  watch: {
    fetchedData: function () {
      if (this.fetchedData) {
        return this.stateObjects.forEach((state) => {
          let fetchedStateData = this.fetchedData.find(
            (data) =>
              data.title === state.name ||
              data.title === state.name + " (state)"
          );

          state.extract = fetchedStateData.extract;
          state.fullurl = fetchedStateData.fullurl;
        });
      }
    },
  },

  created() {
    const endpoint = "https://en.wikivoyage.org/w/api.php?",
      actionAndFormat = "action=query&format=json&formatversion=2&",
      props = "prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&titles=";

    const query = endpoint + actionAndFormat + props;

    //API requires underscore between two-word state names
    const modifyForFetch = function (str, char) {
      if (str.includes(" ")) {
        let b = str.split("");
        b[b.indexOf(" ")] = char;
        str = b.join("");
      }

      if (str === "New_York" || str === "Georgia" || str === "Washington") {
        str = str + " (state)";
      }

      return str;
    };

    //Split states into batches because API will only return a max of 20 page extracts;
    let group1 = _allStates.slice(0, 20).map((s) => modifyForFetch(s, "_")),
      group2 = _allStates.slice(20, 40).map((s) => modifyForFetch(s, "_")),
      group3 = _allStates.slice(40, 50).map((s) => modifyForFetch(s, "_"));

    //Form individual queries for each group.
    const queries = [group1, group2, group3].map((group) => {
      let queryForGroup = query + group.join("|");
      return queryForGroup.slice(0, queryForGroup.length) + "&origin=*";
    });

    //Fetch data from API
    Promise.all(queries.map((q) => fetch(q)))
      .then((res) => {
        let jsonData = res.map((i) => i.json());
        return Promise.all(jsonData);
      })
      .then((data) => {
        let result = data.reduce((a, b) => a.concat(b.query.pages), []);

        return (this.fetchedData = result);
      })
      .catch((err) => console.log(err));
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

https://www.mediawiki.org/w/api.php?action=query&format=json&prop=extracts%7Cinfo&inprop=url
