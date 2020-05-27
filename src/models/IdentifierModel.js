import {helperGetPeriod} from "../Helpers";
import {capitalizeFirstLetter} from "../Helpers";

class IdentifierModel {
  constructor(identifier) {
    this.identifier = identifier;
  }

  getUse(capitalize = false, ifNotFound = undefined) {
    if (this.identifier.use) {
      if (capitalize) return capitalizeFirstLetter(this.identifier.use);
      return this.identifier.use;
    }
    return ifNotFound;
  }

  getTypeText(ifNotFound = undefined) {
    if (!this.identifier.type.text) {
      if (this.identifier.type && this.identifier.coding && this.identifier.coding.length > 0 && this.identifier.coding[0].display) {
        return this.identifier.type.coding[0].display;
      }
      return ifNotFound;
    }
    return this.identifier.type.text;
  }

  getSystem(ifNotFound = undefined) {
    if (this.identifier.system) {
      return this.identifier.system;
    }
    return ifNotFound;
  }

  getValue(ifNotFound = undefined) {
    if (this.identifier.value) {
      return this.identifier.value;
    }
    return ifNotFound;
  }

  getAssignerText(ifNotFound = undefined) {
    if (this.identifier.assigner && this.identifier.assigner.display) {
      return this.identifier.assigner.display;
    }
    return ifNotFound;
  }

  getPeriod(asString=false, ifNotFound=undefined) {
    return helperGetPeriod(this.identifier.period, asString, ifNotFound);
  }
}

export default IdentifierModel;