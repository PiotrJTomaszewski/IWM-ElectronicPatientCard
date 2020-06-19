import Model from "./Model";
import AddressModel from "./AddressModel";
import MetaModel from "./MetaModel";
import TextModel from "./TextModel";
import PatientExtensionModel from "./PatientExtensionModel";
import IdentifierModel from "./IdentifierModel";
import NameModel from "./NameModel";
import TelecomModel from "./TelecomModel";
import MaritalStatusModel from "./MaritalStatusModel";
import CommunicationModel from "./CommunicationModel";

import {capitalizeFirstLetter} from "../Helpers";

export default class PatientModel extends Model {
  constructor(resource) {
    super();
    this.id = this._getPath(resource, "id");
    this.meta = new MetaModel(this._getPath(resource, "meta"));
    this.text = new TextModel(this._getPath(resource, "text"));
    var extTmp = this._getPath(resource, "extension");
    if (extTmp !== undefined && extTmp.length > 0) {
      this.extensions = extTmp.map((ext) => new PatientExtensionModel(ext));
    }
    var identTmp = this._getPath(resource, "identifier");
    if (identTmp !== undefined && identTmp.length > 0) {
      this.identifiers = identTmp.map((ident) => new IdentifierModel(ident));
    }
    var nameTmp = this._getPath(resource, "name");
    if (nameTmp !== undefined && nameTmp.length > 0) {
      this.names = nameTmp.map((name) => new NameModel(name));
    }
    var telecTmp = this._getPath(resource, "telecom");
    if (telecTmp !== undefined && telecTmp.length > 0) {
      this.telecoms = telecTmp.map((telec) => new TelecomModel(telec));
    }
    this.gender = this._getPath(resource, "gender");
    this.birthDate = this._getPath(resource, "birthDate");
    if (this._getPath(resource, "address")) {
      this.addresses = resource.address.map(
        (address) => new AddressModel(address)
      );
    }
    this.maritalStatus = new MaritalStatusModel(this._getPath(resource, "maritalStatus"));
    this.multipleBirthBoolean = this._getPath(resource, "multipleBirthBoolean");
    var commTmp = this._getPath(resource, "communication");
    if (commTmp !== undefined) {
      this.communication = commTmp.map((entry) => new CommunicationModel(entry));
    }
    this.deceasedBoolean = this._getPath(resource, "deceasedBoolean");
    this.deceasedDateTime = this._getPath(resource, "deceasedDateTime");
  }

  getMainName() {
    var officialName;
    var usualName;
    var name;
    for (name of this.names) {
      switch(name.use) {
        case 'official':
          officialName = name;
          break;
        case 'usual':
          usualName = name;
          break;
        default:
          break;
      }
    }
    if (officialName) return officialName;
    if (usualName) return usualName;
    return this.names[0];
  }

  getAge() {
    var ageDiffMilliseconds = Date.now() - new Date(this.birthDate);
    var ageDate = new Date(ageDiffMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  toText() {
    // Patient text in Synthea is garbage
    // var text = this._getPath(`text.div`);
    var mainName = this.getMainName();
    return `${mainName.family}, ${mainName.given[0]}<br/> (${capitalizeFirstLetter(this.gender)} ${this.getAge()}y)`;
  }

  getPatientExtension(extType) {
    for (var i = 0; i < this.extensions.length; i++) {
      if (this.extensions[i].type === extType) {
        return this.extensions[i].value;
      }
    }
    return undefined;
  }

  isDeceased() {
    if (this.deceasedDateTime) {
      return true;
    }
    if (this.deceasedBoolean === false) {
      return false;
    }
    return null;
  }
}
