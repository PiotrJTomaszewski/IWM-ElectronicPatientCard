import Model from "./Model";
import CodingModel from "./CodingModel";
import ValueQuantityModel from "./ValueQuantityModel";

export default class ComponentValueModel extends Model {
    constructor(resource) {
        super();
        this.code = new CodingModel(this._getPath(resource, "code"));
        this.text = this._getPath(resource, "code.text");
        this.valueQuantity = new ValueQuantityModel(this._getPath(resource, "valueQuantity"));
    }

    getValue(roundNumbers=false) {
        var val = this.valueQuantity.value;
        if (val && roundNumbers) {
            val = parseFloat(val).toFixed(3);
        }
        return val;
    }

    getUnit() {
        return this.valueQuantity.unit;
    }
}