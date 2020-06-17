import Model from "./Model";

export default class CodingModel extends Model {
    constructor(resource) {
        super();
        this.code = this._getPath(resource, "coding.0.code");
        this.display = this._getPath(resource, "coding.0.display");
        this.system = this._getPath(resource, "coding.0.system");
    }

    toText() {
        return this.display;
    }
}