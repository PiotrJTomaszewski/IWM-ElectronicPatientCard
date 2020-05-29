import Model from "./Model";
import IdentifierModel from "./IdentifierModel";
import { helperGetPeriod } from "../Helpers";

class ObservationModel extends Model {
  indentifiers = undefined;

  constructor(fhirClient, resource) {
    super(fhirClient, resource);
    var tmp;
    tmp = this._getPath("identifier");
    if (tmp !== undefined) {
      this.indentifiers = tmp.map((element) => {
        return new IdentifierModel(element);
      });
    }
  }

  getId() {
    return this._getPath('id');
  }

  getAllIdentifiers(ifNotFound = undefined) {
    if (this.identifiers) {
      return this.identifiers;
    }
    return ifNotFound;
  }

  getBasedOn(ifNotFound = undefined) {
    console.log("Operation not implemented");
  }

  getPartOf(ifNotFound = undefined) {
    console.log("Operation not implemented");
  }

  getStatus(ifNotFound = undefined) {
    var status = this._getPath("status");
    if (status) {
      return status;
    }
    return ifNotFound;
  }

  getText(ifNotFound = undefined) {
    var text = this._getPath("text.div");
    if (text) {
      // TODO: Provide alternative texts
      return text;
    }
    return ifNotFound;
  }

  getEffectiveDateTime(ifNotFound = undefined) {
    var datetime = this._getPath("effectiveDateTime");
    if (datetime) {
      return datetime;
    }
    return ifNotFound;
  }

  getCode(ifNotFound = undefined) {
    var code = this._getPath("code.coding.0.code");
    if (!code) {
      code = ifNotFound;
    }
    var display = this._getPath("code.text");
    if (!display) {
      display = this._getPath("code.coding.0.display");
    }
    if (!display) {
      display = ifNotFound;
    }
    return {
      code: code,
      display: display,
    };
  }

  getValue(ifNotFound=undefined) {
    var value = this._getPath('valueQuantity');
    if (value) {
      return {
        type: 'quantity',
        value: value.value,
        unit: value.unit
      }
    }
    return ifNotFound; // TODO: Add other value types
  }
}

export default ObservationModel;
