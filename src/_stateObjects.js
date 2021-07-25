import { _allStates } from "./_allStates.js";

class StateObject {
  constructor(name) {
    this.name = name;
    this.found = false;
    this.timestamp = undefined;

    this.extract = undefined;
    this.fullurl = undefined;
  }

  get idFromName() {
    const stateName = this.name;
    let id = stateName.toLowerCase();

    if (id.includes(" ")) {
      let idArr = id.split("");
      const idxOfSpace = idArr.indexOf(" ");

      id = idArr
        .slice(0, idxOfSpace)
        .concat(idArr.slice(idxOfSpace + 1))
        .join("");
    }

    return id;
  }
}

export const _stateObjects = _allStates.map((state) => new StateObject(state));
