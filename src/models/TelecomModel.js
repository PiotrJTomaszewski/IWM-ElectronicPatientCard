import Model from "./Model";
import helperGetPeriod from '../Helpers'

class TelecomModel {
  constructor(telecom) {
    this.telecom = telecom
  }

  getSystem() {
    return this.telecom.system;
  }

  getValue() {
    return this.telecom.value;
  }

  getUse() {
    return this.telecom.use;
  }

  getRank() {
    return this.telecom.rank;
  }

  getPeriod(asString = false, ifNotFound = undefined) {
    return helperGetPeriod(this.telecom.period, asString, ifNotFound);
  }
}

export default TelecomModel;
