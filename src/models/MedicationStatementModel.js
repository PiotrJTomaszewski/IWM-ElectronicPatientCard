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
}

export default MedicationStatementModel;
