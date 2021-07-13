import { _allStates } from "./_allStates.js";

class StateObject {
  constructor(name) {
    this.name = name;
    this.found = false;
    //this.foundTimestamp = undefined;

    this.extract = undefined;
    this.fullurl = undefined;
  }
}

export let _stateObjects = _allStates.map((state) => new StateObject(state));
