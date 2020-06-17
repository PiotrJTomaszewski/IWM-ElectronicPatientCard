import Model from "./Model";

export default class IdentifierModel extends Model {
    constructor(resource) {
        super();
        this.text = this._getPath(resource, "type.text");
        if (this.text === undefined)  {
            this.text = this._getPath(resource, "type.coding.0.display");
        }
        this.system = this._getPath(resource, "system");
        this.value = this._getPath(resource, "value");
    }
}