import { helperGetPeriod } from "../Helpers";
import { capitalizeFirstLetter } from "../Helpers";

class IdentifierModel {
  constructor(identifier) {
    this.identifier = identifier;
  }

  getUse(capitalize = false, ifNotFound = undefined) {
    if (this.identifier.hasOwnProperty("use")) {
      if (capitalize) return capitalizeFirstLetter(this.identifier.use);
      return this.identifier.use;
    }
    return ifNotFound;
  }

  getTypeText(ifNotFound = undefined) {
    if ("type" in this.identifier) {
      if ("text" in this.identifier.type) {
        return this.identifier.type.text;
      }
      if (
        "coding" in this.identifier &&
        this.identifier.coding.length > 0 &&
        "display" in this.identifier.coding[0]
      ) {
        return this.identifier.type.coding[0].display;
      }
    }
    return ifNotFound;
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

  getPeriod(asString = false, ifNotFound = undefined) {
    return helperGetPeriod(this.identifier.period, asString, ifNotFound);
  }
}

export default IdentifierModel;
