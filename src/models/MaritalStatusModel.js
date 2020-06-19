import Model from "./Model";

export default class MaritalStatusModel extends Model {
  static maritalStatusCodes = {
    A: "Annulled",
    D: "Divorced",
    I: "Interlocutory",
    L: "Legally Separated",
    M: "Married",
    P: "Polygamous",
    S: "Never Married",
    T: "Domestic Partner",
    U: "Unmarried",
    W: "Widowed"
  }
  constructor(resource) {
    super();
    this.system = this._getPath(resource, "coding.0.system");
    this.code = this._getPath(resource, "coding.0.code");
    this.display = this._getPath(resource, "coding.0.display");
    this.text = this._getPath(resource, "text");
  }

  toText() {
    var text;
    if (this.text !== undefined) {
      text = this.text;
    } else if (this.display !== undefined) {
      text = this.display;
    } else if (this.code !== undefined) {
      text = this.code;
    }
    if (text && text.length === 1) {
      if (text in MaritalStatusModel.maritalStatusCodes) {
        text = MaritalStatusModel.maritalStatusCodes[text];
      }
    }
    if (text) {
      return text;
    }
    return undefined;
  }
}
