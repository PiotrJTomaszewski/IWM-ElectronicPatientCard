import Model from "./Model";
import CodingModel from "./CodingModel";
import MetaModel from "./MetaModel";
import DosageInstructionModel from "./DosageInstructionModel";

export default class MedicationRequestModel extends Model {
  static statusCodes = {
    active: {code: "active", display: "Active"},
    onHold: {code: "on-hold", display: "On Hold"},
    cancelled: {code: "cancelled", display: "Cancelled"},
    completed: {code: "completed", display: "Completed"},
    enteredInError: {code: "entered-in-error", display: "Entered in Error"},
    stopped: {code: "stopped", display: "Stopped"},
    draft: {code: "draft", display: "Draft"},
    unknown: {code: "unknown", display: "Unknown"},
  }

  static intentCodes = {
    proposal: {code: "proposal", display: "Proposal"},
    plan: {code: "plan", display: "Plan"},
    order: {code: "order", display: "Order"},
    originalOrder: {code: "original-order", display: "Original Order"},
    reflexOrder: {code: "reflex-order", display: "Redlex Order"},
    fillerOrder: {code: "filler-order", display: "Filler Order"},
    instanceOrder: {code: "instance-order", display: "Instance Order"},
    option: {code: "option", display: "Option"},
  }
  
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
