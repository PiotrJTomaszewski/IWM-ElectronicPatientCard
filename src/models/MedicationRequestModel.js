import Model from "./Model";
import CodingModel from "./CodingModel";
import MetaModel from "./MetaModel";
import DosageInstructionModel from "./DosageInstructionModel";

export default class MedicationRequestModel extends Model {
  constructor(resource) {
    super();
    this.authoredOn = this._getPath(resource, "authoredOn");
    if (this._getPath(resource, "dosageInstruction") && resource.dosageInstruction.length > 0) {
        this.dosageInstructions = resource.dosageInstruction.map((d) => new DosageInstructionModel(d));
    }
    this.id = this._getPath(resource, "id");
    this.intent = this._getPath(resource, "intent");
    if (this._getPath(resource, "medicationCodeableConcept")) {
        this.medicationCodeableConcept = {
            text: this._getPath(resource, "medicationCodeableConcept.text"),
            coding: new CodingModel(this._getPath(resource, "medicationCodeableConcept"))
        }
    }
    this.meta = new MetaModel(this._getPath(resource, "meta"));
    this.requester = this._getPath(resource, "requester.display");
    this.status = this._getPath(resource, "status");
  }

  toText() {
    if (this.medicationCodeableConcept.text !== undefined) {
      return this.medicationCodeableConcept.text
    }
    return this.medicationCodeableConcept.coding.display;
  }

  getDosageHtml() {
    if (this.dosageInstructions) {
      return this.dosageInstructions.map(d=>d.toHtml()).join("<br/>");
    }
    return undefined;
  }

}
