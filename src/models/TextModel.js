import Model from "./Model";

export default class TextModel extends Model {
    constructor(resource) {
        super();
        this.status = this._getPath(resource, "status");
        this.div = this._getPath(resource, "div");
    }
}