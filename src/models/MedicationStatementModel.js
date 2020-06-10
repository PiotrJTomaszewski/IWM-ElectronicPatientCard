import Model from "./Model";
import { helperGetPeriod } from "../Helpers";

class MedicationStatementModel extends Model {
  constructor(fhirClient, resource) {
    super(fhirClient, resource);
  }

  getId() {
    return this._getPath('id');
  }

  getText(ifNotFound = undefined) {
    var text = this._getPath("text.div");
    if (text) {
      // TODO: Provide alternative texts
      return text;
    }
    return ifNotFound;
  }

  getEffectivePeriod(asString = false, ifNotFound = undefined) {
    return helperGetPeriod(
      this._getPath("effectivePeriod"),
      asString,
      ifNotFound
    );
  }

  getMedicationReference(ifNotFound = undefined) {
    var display = this._getPath("medicationReference.display");
    var reference = this._getPath("medicationReference.reference");
    return {
      display: display,
      reference: reference,
    };
  }

  getReasonCodeText(ifNotFound = undefined) {
    var text = this._getPath("reasonCode.0.text");
    if (!text) {
      text = this._getPath("reasonCode.0.coding.0.display");
    }
    return text ? text: ifNotFound;
  }

  getStatus(ifNotFound='Unknown') {
    return this._getPath("status") ? this._getPath("status"): ifNotFound;
  }

  getDosage(ifNotFound=undefined) {
    var text = this._getPath("dosage.0.text")
    text = text ? text : ifNotFound;
    var asNeeded = this._getPath("dosage.0.asNeededBoolean")
    asNeeded = (asNeeded !== undefined) ? asNeeded: ifNotFound;
    var routeText = this._getPath("dosage.0.route.coding.0.display")
    routeText = routeText ? routeText : ifNotFound;
    return {text: text, asNeeded: asNeeded, routeText: routeText}
  }
}

export default MedicationStatementModel;
