import Model from "./Model";

export default class ValueQuantityModel extends Model {
    constructor(resource) {
        super();
        this.code = this._getPath(resource, "code");
        this.system = this._getPath(resource, "system");
        this.unit = this._getPath(resource, "unit");
        this.value = this._getPath(resource, "value");
    }

    toText(roundNumbers=false) {
        if (roundNumbers) {
            return `${parseFloat(this.value).toFixed(3)} ${this.unit}`;
        }
        return `${this.value} ${this.unit}`;
    }
}