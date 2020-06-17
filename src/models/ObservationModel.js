import Model from "./Model";
import CodingModel from "./CodingModel";
import MetaModel from "./MetaModel";
import ValueQuantityModel from "./ValueQuantityModel";

export default class ObservationModel extends Model {
  static valueType = {
    "valueQuantity": 0,
    "valueCodeableConcept": 1
  }
  constructor(resource) {
    super();
    this.category = new CodingModel(this._getPath(resource, "category.0"));
    this.id = this._getPath(resource, "id")
    this.code = {coding: new CodingModel(this._getPath(resource, "code")), text: this._getPath(resource, "code.text")};
    this.issued = this._getPath(resource, "issued");
    this.meta = new MetaModel(this._getPath(resource, "meta"));
    this.status = this._getPath(resource, "status");
    this.valueType = undefined;
    if (this._getPath(resource, "valueQuantity")) {
      this.valueType = ObservationModel.valueType["valueQuantity"];
      this.valueQuantity = new ValueQuantityModel(resource.valueQuantity);
    }
    if (this._getPath(resource, "valueCodeableConcept")) {
      this.valueType = ObservationModel.valueType["valueCodeableConcept"];
      this.valueCodeableConcept = {
        coding: new CodingModel(resource.valueCodeableConcept),
        text: this._getPath(resource.valueCodeableConcept, "text")
      }
    }
  }

  getValueText() {
    if (this.valueQuantity !== undefined) {
      return this.valueQuantity.toText();
    }
    if (this.valueCodeableConcept !== undefined) {
      return this.valueCodeableConcept.text;
    }
    return undefined;
  }

}
