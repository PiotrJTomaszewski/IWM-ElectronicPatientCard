import Model from "./Model";

export default class NameModel extends Model {
    constructor(resource) {
        super();
        this.use = this._getPath(resource, "use");
        this.family = this._getPath(resource, "family");
        this.given = this._getPath(resource, "given");
        this.prefix = this._getPath(resource, "prefix")
    }

    getJoinedGiven() {
        if (this.given !== undefined) {
            return this.given.join(" ");
        }
        return undefined;
    }

    getFullName() {
        var name = "";
        if (this.prefix !== undefined && this.prefix.length > 0) {
            name += this.prefix.join(" ") + " ";
        }
        if (this.given !== undefined && this.given.length > 0) {
            name += this.given.join(" ") + " ";
        }
        if (this.family !== undefined) {
            name += this.family;
        }
        return name;
    }
}