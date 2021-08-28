<template>
  <v-container
    :id="idFromName"
    :class="{
      'my-3 elevation-6': open,
      white: !state.found,
      'light-green lighten-5': state.found,
      'rounded-t': rounded[0],
      'rounded-b': rounded[1],
    }"
  >
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="auto">
        <v-checkbox
          :label="state.name"
          :input-value="state.found"
          @click="$emit('state-toggled', state.found)"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn
          icon
          @click="
            [
              (open = !open),
              fetchData(copyQuery),
              fetchData(imgQuery),
              fetchData(quickFactsQuery),
            ]
          "
        >
          <v-icon :class="{ arrowUp: open }">mdi-chevron-down</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-container fluid v-show="open" :style="maxHeight">
        <template v-if="!loading">
          <v-row>
            <v-col cols="12" sm="5" md="4">
              <v-img
                :src="img"
                max-height="300"
                class="rounded-sm elevation-3"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="7" md="8">
              <h3>About {{ state.name }}</h3>
              <span>{{ extract }}</span>
              <v-container class="mt-3 pa-0">
                <v-row>
                  <v-col class="pb-0">
                    <h3>Quick Facts</h3>
                  </v-col>
                </v-row>
                <v-row>
                  <template v-for="(fact, i) in quickFacts">
                    <v-col
                      :key="i"
                      cols="auto"
                      v-if="fact[getQuickfactProp(fact)]"
                    >
                      <v-chip
                        :color="state.found ? 'light-green lighten-4' : ''"
                      >
                        <span class="font-weight-bold"
                          >{{ fact.fact }}: &nbsp;</span
                        >
                        <span>{{
                          formatQuickFact(fact[getQuickfactProp(fact)])
                        }}</span>
                      </v-chip>
                    </v-col>
                  </template>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center"
              ><sub class="font-weight-light"
                >Image and information provided by WikiMedia.</sub
              ></v-col
            >
          </v-row>
        </template>
        <template v-else>
          <v-skeleton-loader type="image, article" />
        </template>
      </v-container>
    </v-expand-transition>
  </v-container>
</template>

<script>
import { wikiVoyageQuery } from "../queries.js";
import { wikipediaImgQuery } from "../queries.js";
import { wikidataQuery } from "../queries.js";
import { headers } from "../queries.js";

export default {
  props: ["state", "idx", "filterValue", "rounded"],

  data() {
    return {
      open: false,

      extract: undefined,
      url: undefined,
      img: undefined,
      quickFacts: [
        { fact: "Inception", propVal: "P571", time: undefined },
        { fact: "Nickname", propVal: "P1449", text: undefined },
        { fact: "Motto", propVal: "P1451", text: undefined },
        { fact: "Capital", propVal: "P36", "wikibase-item": undefined },
        { fact: "Highest Pt.", propVal: "P610", "wikibase-item": undefined },
        { fact: "Lowest Pt.", propVal: "P1589", "wikibase-item": undefined },
        { fact: "Population", propVal: "P1082", amount: undefined },
      ],
    };
  },

  computed: {
    copyQuery() {
      return wikiVoyageQuery + this.nameForFetch;
    },
    imgQuery() {
      let [start, end] = wikipediaImgQuery.split("STATENAME");

      return [start, this.state.name, end].join("");
    },
    quickFactsQuery() {
      let [start, end] = wikidataQuery.split("ENTITYID");

      return [start, this.state.wikidataId, end].join("");
    },
    loading() {
      if (this.extract && this.url && this.img) {
        return false;
      }

      return true;
    },
    maxHeight() {
      if (this.$vuetify.breakpoint.name === "xs") {
        return "max-height:366px;overflow:scroll;";
      }

      return "";
    },

    idFromName() {
      if (this.state.name === "Washington, D.C.") {
        return "washingtondc";
      }

      let id = this.state.name.toLowerCase();

      if (id.includes(" ")) {
        let idArr = id.split("");

        let sliceStart = 0;
        let idxOfSpace = idArr.indexOf(" ");

        while (idxOfSpace !== -1) {
          idArr = idArr
            .slice(sliceStart, idxOfSpace)
            .concat(idArr.slice(idxOfSpace + 1));

          sliceStart = idxOfSpace;
          idxOfSpace = idArr.indexOf(" ");
        }

        id = idArr.join("");
      }

      return id;
    },

    nameForFetch() {
      let a = this.state.name;

      if (a.includes(" ")) {
        let b = a.split("");
        b[b.indexOf(" ")] = "_";
        a = b.join("");
      }

      if (a === "New_York" || a === "Georgia" || a === "Washington") {
        a = a + " (state)";
      }

      return a;
    },
  },

  methods: {
    getQuickfactProp(fact) {
      let keys = Object.keys(fact);

      return keys[keys.length - 1];
    },
    async fetchData(query) {
      await fetch(query, headers)
        .then((rsp) => rsp.json())
        .then((rspData) => {
          if (query === this.copyQuery) {
            let data = rspData.query.pages[0];

            this.url = data.fullurl;
            this.extract = data.extract;

            return;
          }

          if (query === this.imgQuery) {
            this.img = rspData.preferred.url;

            return;
          }

          if (query === this.quickFactsQuery) {
            this.quickFacts.forEach((fact) => {
              let claim = rspData.claims[fact.propVal];

              if (claim.length == 1) {
                claim = claim[0];
              } else {
                claim.some((c) => c.rank == "preferred")
                  ? (claim = claim.find((c) => c.rank == "preferred"))
                  : (claim = claim.find((c) => c.rank == "normal"));
              }

              let datatype = claim.mainsnak.datatype;

              if (datatype === "wikibase-item") {
                let followUpItem = claim.mainsnak.datavalue.value.id;

                fetch(
                  `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${followUpItem}&sites=enwiki&titles=&props=labels&formatversion=2&origin=*`
                )
                  .then((res) => res.json())
                  .then((rspData) => {
                    fact["wikibase-item"] =
                      rspData.entities[followUpItem].labels.en.value;
                  });
              } else {
                let prop = this.getQuickfactProp(fact);
                fact[prop] = claim.mainsnak.datavalue.value[prop];
              }
            });

            return;
          }
        })
        .catch((err) => console.log(err));
    },
    formatQuickFact(data) {
      let incept = this.quickFacts[0];
      let population = this.quickFacts[this.quickFacts.length - 1];

      if (data === incept[this.getQuickfactProp(incept)]) {
        data = data.slice(1, 11);

        let [year, month, day] = data.split("-");

        return `${month}/${day}/${year}`;
      }

      if (data === population[this.getQuickfactProp(population)]) {
        data = parseInt(data.slice(1));

        return data.toLocaleString();
      }

      return data;
    },
  },
};
</script>

<style>
.arrowUp {
  transform: rotate(-0.5turn);
}
.panel {
  transition: all 500ms ease;
}
</style>
