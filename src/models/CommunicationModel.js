import Model from "./Model";

export default class CommunicationModel extends Model {
    constructor(resource) {
        super();
        this.system = this._getPath(resource, "language.coding.0.system");
        this.code = this._getPath(resource, "language.0.code");
        this.display = this._getPath(resource, "language.0.display");
        this.text = this._getPath(resource, "language.text");
    }

    getTextOrDisplay() {
        if (this.text !== undefined) {
            return this.text;
        }
        if (this.display !== undefined) {
            return this.display;
        }
        return undefined;
    }
}