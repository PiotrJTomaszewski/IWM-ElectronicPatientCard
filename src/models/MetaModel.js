import Model from "./Model"

export default class MetaModel extends Model {
    constructor(resource) {
        super();
        this.versionId = this._getPath(resource, "versionId");
        this.lastUpdated = this._getPath(resource, "lastUpdated");
        this.source = this._getPath(resource, "source");
    }
}