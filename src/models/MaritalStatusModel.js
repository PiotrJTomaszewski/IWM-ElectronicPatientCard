import Model from "./Model";

export default class MaritalStatusModel extends Model {
  constructor(resource) {
    super();
    this.system = this._getPath(resource, "coding.0.system");
    this.code = this._getPath(resource, "coding.0.code");
    this.display = this._getPath(resource, "coding.0.display");
    this.text = this._getPath(resource, "text");
  }

  toText() {
    if (this.text !== undefined) {
      return this.text;
    }
    if (this.display !== undefined) {
      return this.display;
    }
    if (this.code !== undefined) {
      return this.code;
    }
    return undefined;
  }
}
