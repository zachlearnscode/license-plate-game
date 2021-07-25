import { _allStates } from "./_allStates.js";

const endpoint = "https://en.wikivoyage.org/w/api.php?",
  actionAndFormat = "action=query&format=json&",
  props =
    "prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&formatversion=2&titles=";

const query = endpoint + actionAndFormat + props;

function modifyForFetch(str, char) {
  let a = str;

  if (a.includes(" ")) {
    let b = a.split("");
    b[b.indexOf(" ")] = char;
    a = b.join("");
  }

  if (a === "New_York" || a === "Georgia" || a === "Washington") {
    a = a + " (state)";
  }

  return a;
}

let group1 = _allStates.slice(0, 20).map((s) => modifyForFetch(s, "_")),
  group2 = _allStates.slice(20, 40).map((s) => modifyForFetch(s, "_")),
  group3 = _allStates
    .slice(40, _allStates.length)
    .map((s) => modifyForFetch(s, "_"));

export const _queries = [group1, group2, group3].map((group) => {
  let queryForGroup = query + group.join("|");

  return queryForGroup.slice(0, queryForGroup.length) + "&origin=*";
});
